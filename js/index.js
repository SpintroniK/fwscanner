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


const checkVersion = function() 
{
    const agent = window.navigator.userAgent
    const start = agent.indexOf('OS ')
    if((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1 ) && start > -1)
    {
        return parseFloat(agent.substr(start + 3, 4).replace( '_', '.' ))
    }
    return Number.MAX_SAFE_INTEGER
}

const baseUrl = new URL('./', document.baseURI).href;


// TODO: Extract manifest js
fetch(`manifest.json`)
.then(resp => resp.json(),
      error => console.error(error))
.then(j => 
      {
          const h = document.getElementsByTagName('head')[0]
          const l = document.createElement('link')
          l.rel = 'manifest'

          j.start_url = baseUrl + j.start_url
          j.icons.map(i => i.src = baseUrl + i.src)

          if(checkVersion() < 13.4)
              j.display = 'browser'

          const stringManifest = JSON.stringify(j)
          const blob = new Blob([stringManifest], {type: 'application/json'})
          const manifestURL = URL.createObjectURL(blob)
          l.href = manifestURL
          h.appendChild(l)
      },
      error => console.error(error))


// Service worker
if('serviceWorker' in navigator) 
{
   window.addEventListener('load', () => 
   {
     navigator.serviceWorker.register('./service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
}