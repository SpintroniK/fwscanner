import scan from '../scan.js';
import scanModule from '../scan.wasm';


// Since webpack will change the name and potentially the path of the 
// `.wasm` file, we have to provide a `locateFile()` hook to redirect
// to the appropriate URL.
// More details: https://kripken.github.io/emscripten-site/docs/api_reference/module.html
const module = scan({
  locateFile(path) {
    if(path.endsWith('.wasm')) {
      return scanModule;
    }
    return path;
  }
});


let processing = false;

// 'Pointer' to the image data (null until allocated)
let imagep = null;
let resultsBuffer = [];

var document = {}

let BarcodeModule = {};
let Scanner = {};

module
.then(m =>
{
    BarcodeModule = m;
    Scanner = new m.Scanner();
    postMessage({cmd: 'wasmInitialized'});
});


function processResults(buffer)
{
    const sortedBuffer = buffer.sort((a, b) => a['quality'] > b['quality']);

    if(sortedBuffer[sortedBuffer.length -1].barcode == sortedBuffer[sortedBuffer.length -1].barcode)
        return sortedBuffer[sortedBuffer.length -1];
    
    return false;
}

/**
 * 
 * @param {Number} width Image width in pixels
 * @param {Number} height Image height in pixels
 * @param {Buffer} d Image data (from canvas)
 */
function processFrame(width, height, data)
{

    if(!processing)
    {

        processing = true;
        if(!imagep)
        {
            // Allocate image wasm memory
            imagep = BarcodeModule._malloc(width * height);
        }

        const last = Date.now();


        // Create image data view
        const pixels = new Uint8Array(BarcodeModule.HEAPU8.buffer, imagep, width * height);

        const d = new Uint8Array(data);

        // Convert image to grayscale
        for(let i = 0, j = 0; i < d.length; i += 4, j++) 
        {
            pixels[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8;
        }


        // Find barcode in image
        Scanner.scan_image(imagep, width, height);

        // self.postMessage({cmd: 'timing', time: Date.now() - last});

        const res = getResult();

        if(res)
        {
            resultsBuffer.push(res);

            if(resultsBuffer.length == 3)
            {
                const result = processResults(resultsBuffer);
                resultsBuffer = [];

                if(result)
                    self.postMessage({cmd: 'shareResult', barcode: result.barcode, rect: result.rect});
            }
        }

        processing = false;
        self.postMessage({cmd: 'processed'});

    }

}

function getResult()
{
    const str = Scanner.get_result();

    if(str.length == 0)
        return false;

    const vec = Scanner.get_rect();

    const resultArray = new Uint32Array(vec.size());
    for(let i = 0; i < vec.size(); i++)
        resultArray[i] = vec.get(i);

    const q = Scanner.get_quality();
        
    return {barcode: str, quality: q, rect: resultArray};
}


self.onmessage = e =>
{
    switch(e.data.cmd)
    {
        case 'processFrame': 
                processFrame(e.data.width, e.data.height, e.data.imageData);
            break;
    }
};


