import Vue from 'vue'
import App from '../vue/App.vue'
Vue.config.productionTip = false


new Vue({
    el: '#app',
    render: h => h(App),
    mounted() {}
  })