import Vue from 'vue'
import App from '../vue/App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false

Vue.use(Buefy)

new Vue({
    el: '#app',
    render: h => h(App),
    mounted() {}
  })