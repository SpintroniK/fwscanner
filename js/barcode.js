import Worker from './barcode_worker.js';


export default class BarcodeReader
{
    constructor(params)
    {
        this.initialized = false;
        this.isProcessing = false;
        this.rect = null;
        this.doDrawRect = false;
        this.displayCanvas = null;
        this.callback = data => {};

        if('drawRect' in params)
        {
            if(params.drawRect)
            {
                this.doDrawRect = true;
            }
        }

        if('drawingCanvas' in params)
        {
            this.displayCanvas = params.drawingCanvas;
        }

        // Create barcode worker
        this.barcode_worker = new Worker();


        // Barcode worker onmessage event
        this.barcode_worker.onmessage = e =>
        {
            switch(e.data.cmd)
            {
                case 'wasmInitialized': this.initialized = true; break;
                // case 'timing': document.getElementById('info').innerHTML = `${e.data.time} ms`; break;
                case 'shareResult': this.setRect(e.data.rect); this.callback(e.data); break;
                case 'processed': this.isProcessing = false; break;
            }
        };
    }

    displayResult(result)
    {
        document.getElementById('result').innerHTML = result; 
    }
    
    setRect(r)
    {
        this.rect = r;
    }
    
    drawRect()
    {
        if(this.rect && this.displayCanvas)
        {
            const rect = this.rect;
            const displayContext = this.displayCanvas.getContext('2d');
            // Red rectangle
            displayContext.beginPath();
            displayContext.lineWidth = "2";
            displayContext.strokeStyle = "red";
            displayContext.rect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);  
            displayContext.stroke();
        }
    }

    registerCallback(cb)
    {
        this.callback = data => cb(data);
    }

    process(canvas)
    {
        if(this.initialized )
        {

            this.context = canvas.getContext('2d');

            if(this.displayCanvas)
            {
                this.displayCanvas.width = canvas.width;
                this.displayCanvas.height = canvas.height;

                this.displayContext = this.displayCanvas.getContext('2d');
                this.displayContext.drawImage(canvas, 0, 0);

                if(this.doDrawRect)
                {
                    this.drawRect(this.displayContext);
                }
            }

            const d = this.context.getImageData(0, 0, canvas.width, canvas.height).data;

            // const displayData = displayContext.getImageData(0, 0, ncols, nrows);

            // // for(let i = 3; i < displayData.data.length; i+=4)
            // // {
            // //     displayData.data[i] = 50;
            // // }

            // displayContext.putImageData(displayData, 0, 0); 

            if(!this.isProcessing)
            {
                this.isProcessing = true;
                this.barcode_worker.postMessage
                ({
                    cmd: 'processFrame', 
                    width: canvas.width, 
                    height: canvas.height, 
                    imageData: d.buffer
                }, [d.buffer]);
            }
        }
    }
}


