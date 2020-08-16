<template>
  <div>
    <div id="scanner">
      <div id="info"></div>
      <div id="cameras"></div>
    </div>  

    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>

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
               isLoading: false,
               camError: false
             }
  },
  methods: 
  {
    showCamError() 
    {
      this.isLoading = false
      this.$buefy.dialog.alert({
          title: 'Error',
          message: this.camErrorDesc,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          ariaRole: 'alertdialog',
          ariaModal: true,
          onConfirm: _ => {this.$router.push({ name: 'home'})}
      })
    },
    showProduct(productData) 
    {
      const nutriments = productData.nutriments
      console.log(nutriments)
    },
    resetState()
    {
      this.barcode = ''
      this.displayProduct = false

    },
    handleCanvasSize(stream)
    {
      
      
      // const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      // const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      // const cw = stream.video.videoWidth
      // const ch = stream.video.videoHeight


      // alert(`width = ${cw}, height = ${ch} / width = ${vw}, height = ${vh}`)

      // // // Manage canvas size
      // const displayCanvas = document.getElementById('displayCanvas')

      // displayCanvas.style.position = 'fixed'

      // const horitontalRatio = vw / cw
      // const verticalRatio = vh / ch


      // let ratio = Math.min(horitontalRatio, verticalRatio)

      // const newWidth = parseInt(cw*ratio)
      // const newHeight = parseInt(ch*ratio)

      // const leftOffset = Math.max(0, parseInt((vw - newWidth) / 2))
      // const topOffset = Math.max(0, parseInt((vh - newHeight) / 2))


      // alert(`newWidth = ${newWidth}/${vw}, newHeight = ${newHeight}/${vh}`)

      // displayCanvas.style.left = `${leftOffset}px`
      // displayCanvas.style.top = `${topOffset}px`
      // displayCanvas.style.width = `${newWidth}px`
      // displayCanvas.style.height = `${newHeight}px`
      // displayCanvas.style.objectFit = 'fill'

    },
    async startScanner()
    {
      this.isLoading = true
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
              this.camErrorDesc = 'The Camera cannot be opened: permission denied.'
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

        this.showCamError()
      }


      // Hide video
      // stream.video.style.width = '1px';
      // stream.video.style.height = '1px';
      // Hide video
      stream.canvas.style.width = '1px';
      stream.canvas.style.height = '1px';

      // Hide canvas
      stream.canvas.style.display = 'block';

      this.handleCanvasSize(stream)
      window.addEventListener("orientationchange", _ =>
      {
        setTimeout(_ => this.handleCanvasSize(stream), 500)
      }, false)


      const barcordReader = new BarcodeReader({drawRect: false});
      
      const resultCallback = d => 
      {
        cam.Stop()
        this.$router.push({ name: 'product', query: {id: d.barcode}})
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

      this.isLoading = false
      this.showHome = false
      this.showScanner = true
    }
  },
  mounted () {
    this.startScanner()
  }
}

</script>

<style>

  #scanner
  {
    background-color: #141418;
  }
  video
  {
      position: fixed;
      top: 0;
      left: 0;
      object-fit: contain;
  }


</style>
