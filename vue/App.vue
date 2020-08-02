<template>
  <div>
    <div id="home" v-if="showHome">
      <section class="hero is-large is-fullheight is-light">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              FWScanner
            </h1>
            <h2 class="subtitle">
              A fast barcode scanner for the web.
              <br />
              <br />
              <div class="has-text-centered">
                <button @click="startScanner" id="startButton" class="button is-primary is-medium" 
                        :class="{'is-loading': loadingScanner}">Scan product</button>
              </div>
            </h2>
          </div>
        </div>
      </section>
    </div>
    <div id="scanner" v-show="showScanner">
      <div id="info"></div>
      <div id="cameras"></div>
      <div id="container">
          <canvas id="displayCanvas"></canvas>
      </div>
    </div>  
    <div class="modal" :class="{'is-active': camError}" @click="resetCamError()">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          {{ camErrorDesc }}
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="resetCamError()"></button>
    </div>
    <div class="modal" :class="{'is-active': displayProduct}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ barcode }}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          toto
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">OK</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>

import Camera from './../js/cameras.js'
import BarcodeReader from './../js/barcode.js'

export default {

  data() 
  {
      return { barcode: '',
               camErrorDesc: '',
               displayProduct: false,
               showHome: true,
               showScanner: false,
               loadingScanner: false,
               camError: false
             }
  },
  methods: 
  {
    resetCamError()
    {
      this.camError = false
      this.camErrorDesc = ''
      this.loadingScanner = false
    },
    async startScanner()
    {
      this.loadingScanner = true
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
              this.camErrorDesc = 'Unable to find camera.'
          }
          else if(err.name == "NotReadableError" || err.name == "TrackStartError") 
          {
              //webcam or mic are already in use 
              this.camErrorDesc = 'Camera already in use.'
          }
          else if(err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError")
          {
              //constraints can not be satisfied by avb. devices 
              this.camErrorDesc = 'Camera cannot be opened: wrong parameters.'
          }
          else if(err.name == "NotAllowedError" || err.name == "PermissionDeniedError")
          {
              //permission denied in browser 
              this.camErrorDesc = 'Camera cannot be opened: permission denied.'
          }
          else if(err.name == "TypeError")
          {
              //empty constraints object 
              this.camErrorDesc = 'Camera cannot be opened: wrong parameters.'
          }
          else
          {
              //other errors 
              this.camErrorDesc = 'Camera cannot be opened: unknown error.'
          }

          this.camError = true
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
          this.barcode = data.barcode
          this.displayProduct = true
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

      this.showHome = false
      this.showScanner = true
      this.loadingScanner = false
    }
  }
}

// https://world.openfoodfacts.org/api/v0/product/3068320080000.json
</script>

<style>

  @import '~bulma/css/bulma.css';

  #displayCanvas
  {
    width: 100vw;
    max-height: 90vh;
  }

</style>