import Main from '../vue/Main.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import { ConfigProgrammatic } from 'buefy'
ConfigProgrammatic.setOptions({ defaultIconPack: 'fas', defaultIconComponent: 'vue-fontawesome' })

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueRouter)

const Router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/',
      component: resolve => require(['../vue/Home.vue'], resolve),
      name: 'home'
    },
    {
      path: '/scan',
      component: resolve => require(['../vue/Scanner.vue'], resolve),
      name: 'scanner'
    },
    {
      path: '/product',
      component: resolve => require(['../vue/Product.vue'], resolve),
      name: 'product'
    }
  ]
})

new Vue({
    el: '#app',
    router: Router,
    render: h => h(Main),
    mounted() {}
  })