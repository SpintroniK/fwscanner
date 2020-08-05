import Vue from 'vue'
import App from '../vue/App.vue'

import { ConfigProgrammatic } from 'buefy'
ConfigProgrammatic.setOptions({ defaultIconPack: 'far', defaultIconComponent: 'vue-fontawesome' })

Vue.config.productionTip = false

new Vue({
    el: '#app',
    render: h => h(App),
    mounted() {}
  })