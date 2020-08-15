<template>
	<div>
    <transition name="slide" mode="out-in">
    	<router-view></router-view>
    </transition>
	</div>
</template>

<script>


import { library } from '@fortawesome/fontawesome-svg-core'

// internal icons
import { faTimesCircle, faArrowRight, faCopyright, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faTimesCircle, faArrowRight, faCopyright, faExclamationTriangle)

import Vue from 'vue'
Vue.component('vue-fontawesome', FontAwesomeIcon)

export default {
	
}
</script>

<style>

    .slide-enter-active, .slide-leave-active
    {
        transition: opacity var(--transition-speed);
    }
    .slide-enter, .slide-leave-to
    {
        opacity: 0;
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
  @import "~buefy/src/scss/buefy.scss";

</style>