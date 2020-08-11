<template>
  <section class="bd-index-fullscreen hero is-fullheight is-light">

    <div class="hero-head">
      <div class="container">
        <div class="tabs is-centered">
          <ul>
            <li> <a><strong>{{ appInstall }}</strong></a></li>
          </ul>
        </div>
      </div>
    </div>
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
        <router-link :to="{name: 'scanner'}" tag="nav" class="buttons is-centered">
          <a class="button is-large is-primary">
            <span>Scan product</span>
            <b-icon
              pack="fas"
              icon="arrow-right">
            </b-icon>
          </a>
        </router-link>
      </div>
    </div>

    <div class="hero-foot">
      <div class="container">
        <div class="tabs is-centered">
          <ul>
            <li><a><b-icon pack="fas" icon="copyright" size="is-small" type="is-primary"></b-icon>
            <strong class="has-text-primary">Free</strong><strong>Webmaster</strong></a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  data()
  {
    return {
      appInstall: ''
    }
  },
  mounted()
  {
    if(!window.matchMedia('(display-mode: standalone)').matches) 
    {
      this.appInstall = 'INSTALL APP'
    }
  }
}
</script>