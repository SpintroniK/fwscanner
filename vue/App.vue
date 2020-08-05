<template>
  <div>
    <section v-if="showHome" class="bd-index-fullscreen hero is-fullheight is-light">

      <!-- <div class="hero-head">
        <div class="container">
          <div class="tabs is-centered">
            <ul>
              <li>...</li>
            </ul>
          </div>
        </div>
      </div> -->
      <div class="hero-body">
        <div class="container">
          <header class="bd-index-header">
            <h3 class="title is-3">
              <a>
                FWScanner 
              </a>
            </h3>
            <h4 class="subtitle is-4">
              A fast barcode scanner for the web.
            </h4>
          </header>
          <br />
          <nav class="buttons is-centered" @click="startScanner">
            <a class="button is-large is-primary">
              <span>Scan product</span>
              <b-icon
                pack="fas"
                icon="arrow-right">
              </b-icon>
            </a>
          </nav>
        </div>
      </div>

      <div class="hero-foot">
        <div class="container">
          <div class="tabs is-centered">
            <ul>
              <li><a><b-icon pack="fas" icon="copyright" size="is-small" type="is-primary"></b-icon>FreeWebmaster</a></li>
            </ul>
          </div>
        </div>
      </div>

    </section>

    <div id="scanner" v-show="showScanner">
      <div id="info"></div>
      <div id="cameras"></div>
      <div id="container">
          <canvas id="displayCanvas"></canvas>
      </div>
    </div>  

    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>

  </div>
</template>import Vue from 'vue'

<script>

import Camera from './../js/cameras.js'
import BarcodeReader from './../js/barcode.js'

import { library } from '@fortawesome/fontawesome-svg-core'

// internal icons
import { faTimesCircle, faArrowRight, faCopyright } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faTimesCircle, faArrowRight, faCopyright)
Vue.component('vue-fontawesome', FontAwesomeIcon)

import Vue from 'vue'
import { Loading, DialogProgrammatic as Dialog, Dialog as D, Icon} from 'buefy'

Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Icon)
Vue.use(D)


export default {

  data() 
  {
      return { barcode: '',
               camErrorDesc: '',
               displayProduct: false,
               showHome: true,
               showScanner: false,
               isLoading: false,
               camError: false
             }
  },
  methods: 
  {
    showCamError() 
    {
      this.isLoading = false
      Dialog.alert({
          title: 'Error',
          message: this.camErrorDesc,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          ariaRole: 'alertdialog',
          ariaModal: true
      })
    },
    showProduct(productData) 
    {
      Dialog.confirm({
          title: productData.product_name,
          message: productData.generic_name_fr,
          cancelText: 'Home screen',
          confirmText: 'Scan new product',
          onCancel: _ => document.location = './',
          onConfirm: _=> this.resetState()
      })
    },
    resetState()
    {
      this.barcode = ''
      this.displayProduct = false

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
      stream.video.style.width = '1px';
      stream.video.style.height = '1px';
      // Hide video
      stream.canvas.style.width = '1px';
      stream.canvas.style.height = '1px';

      // Hide canvas
      stream.canvas.style.display = 'block';

      const displayCanvas = document.getElementById('displayCanvas');

      const barcordReader = new BarcodeReader({drawRect: true, drawingCanvas: displayCanvas});
      
      const resultCallback = async d => 
      {
        
        if(!this.displayProduct)
        {
          this.isLoading = true
          this.displayProduct = true
          const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${d.barcode}.json`)
          const data = await response.json()

          this.isLoading = false
          this.showProduct(data.product)
        }
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
  }
}

</script>

<style>
  #displayCanvas
  {
    width: 100vw;
  }
</style>

<style lang="sass">

  @import "~bulma/sass/utilities/_all";

  $primary: #d23232;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099FF;
  $twitter-invert: findColorInvert($twitter);

  $black: #141418;
  $white: findColorInvert($black);

  $colors: (
      "white": ($white, $black),
      "black": ($black, $white),
      "light": ($black, $white),
      "dark": ($dark, $dark-invert),
      "primary": ($primary, $primary-invert),
      "info": ($info, $info-invert),
      "success": ($success, $success-invert),
      "warning": ($warning, $warning-invert),
      "danger": ($danger, $danger-invert),
      "twitter": ($twitter, $twitter-invert)
  );

  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  @import "~bulma";
  @import "~buefy/src/scss/components/_dialog.scss";
  @import "~buefy/src/scss/components/_loading.scss";
  @import "~buefy/src/scss/utils/_all.scss";

</style>