import Vue from 'vue'
import App from '../vue/App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'

// internal icons
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faTimesCircle)
Vue.component('vue-fontawesome', FontAwesomeIcon)

import Buefy from 'buefy'

Vue.use(Buefy, { defaultIconComponent: 'vue-fontawesome', defaultIconPack: 'fas' });

import 'buefy/dist/buefy.css'

Vue.config.productionTip = false


new Vue({
    el: '#app',
    render: h => h(App),
    mounted() {}
  })