import Vue from 'vue'
import App from './vue/App.vue'
import Camera from './cameras.js';
import BarcodeReader from './barcode.js';
Vue.config.productionTip = false


const f = (async _ =>
  {
      let stream = null;
      const cam = new Camera('back');
  
      try
      {
          const constraints = 
          {
              audio: false,
              video: { 
                          width: { min: 600, ideal: 1280 },
                          height: { min: 480, ideal: 720 }, 
                          facingMode: { ideal: 'environment' }
                      }
          };
  
          stream = await cam.Open(constraints);
          await cam.Start();
      }
      catch(err)
      {
          if(err.name == "NotFoundError" || err.name == "DevicesNotFoundError")
          {
              //required track is missing 
          }
          else if(err.name == "NotReadableError" || err.name == "TrackStartError") 
          {
              //webcam or mic are already in use 
          }
          else if(err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError")
          {
              //constraints can not be satisfied by avb. devices 
          }
          else if(err.name == "NotAllowedError" || err.name == "PermissionDeniedError")
          {
              //permission denied in browser 
          }
          else if(err.name == "TypeError")
          {
              //empty constraints object 
          }
          else
          {
              //other errors 
          }
      }
  
  
  
      // Hide video
      stream.video.style.width = '1px';
      stream.video.style.height = '1px';
      // Hide video
      stream.canvas.style.width = '1px';
      stream.canvas.style.height = '1px';
  
      // Hide canvas
      stream.canvas.style.display = 'block';
  
      const displayCanvas = document.getElementById('displayCanvas');
  
      const barcordReader = new BarcodeReader({drawRect: true, drawingCanvas: displayCanvas});
  
  
      const resultCallback = data => 
      {
          document.getElementById('result').innerHTML = data.barcode;
      };
  
      barcordReader.registerCallback(resultCallback);
  
  
      const renderCallback = _ =>
      {
          if(stream.video.readyState === stream.video.HAVE_ENOUGH_DATA && !stream.video.paused)
          {
              const context = stream.canvas.getContext('2d');
  
              context.drawImage(stream.video, 0, 0);
              barcordReader.process(stream.canvas);
          }
  
          requestAnimationFrame(renderCallback)
      }
  
      requestAnimationFrame(renderCallback);
  
  
  })

new Vue({
    el: '#app',
    render: h => h(App),
    mounted() { f() }
  })