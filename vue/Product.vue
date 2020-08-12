<template>
  <div>
    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img :src="productInfo.image_front_url" id="product-image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="productInfo.image_thumb_url">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{productInfo.product_name}}</p>
            <p class="subtitle is-6">{{productInfo.generic_name}}</p>
          </div>
        </div>

        <div class="columns is-mobile" v-for="nutriment in validNutrimentNames " :key="nutriment">
          <div class="column has-text-right is-one-third is-capitalized">{{nutriment}}</div>
          <div class="column">
            <b-progress :value="getValue(nutriment, nutrimentsValues[nutriment])"
                        :type="getNutrimentType(nutriment, nutrimentsValues[nutriment])" show-value size="is-large">
              {{nutrimentsValues[nutriment]}}
            </b-progress>
          </div>
        </div>
        <div class="content">
        </div>
      </div>
    </div>
    <router-link :to="{name: 'scanner'}" tag="nav" class="buttons is-centered">
      <a class="button is-primary mt-3 mb-3">
        <span>Scan another product</span>
        <b-icon pack="fas" icon="arrow-right"></b-icon>
      </a>
    </router-link>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>
<script>

// TODO: add red thresholds

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} )

Object.filterKeys = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(key) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} )

export default {
  data()
  {
    return {
      barcode: '',
      isLoading: true,
      productInfo: false,
      nutrimentsValues: {},
      validNutrimentNames: ['sugars', 'fat', 'saturated-fat', 'proteins', 'fiber', 'salt'],
      numtrimentsThresMax: {'sugars': {t: 18, m: 45},
                            'fat': {t: 1000, m: 50},
                            'fiber': {t: 1000, m: 7},
                            'proteins': {t: 1000, m: 16},
                            'salt': {t: 0.92, m: 2.3},
                            'saturated-fat': {t: 4, m: 10},}
    }
  },
  methods:
  {
    async getProduct(id)
    {
      this.isLoading = true
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${id}.json`)
      const data = await response.json()

      if(data.status != 1)
      {
        this.isLoading = false
        this.$buefy.dialog.alert({message: `API returned <strong>${data.status_verbose}</strong>.`,
                                  confirmText: 'Scan again',
                                  type: 'is-warning',
                                  hasIcon: true,
                                  onConfirm: _ => {this.$router.push({ name: 'scanner'})}
                                  })
        return
      }

      this.productInfo = data.product
      this.isLoading = false
      const nutrimentsNames = this.validNutriments.map(x => x.replace('_100g', ''))
      this.nutrimentsValues = Object.assign({}, ...nutrimentsNames.map(x => ({[x]: Number((this.productInfo.nutriments[x]).toFixed(2))})))
    },
    getNutrimentType(name, val)
    {
      if(val < this.numtrimentsThresMax[name].t)
      {
        return {'is-success': true}
      }
      else
      {
        return {'is-warning': true}
      }
    },
    getValue(name, val)
    {
      return 100*val/this.numtrimentsThresMax[name].m
    }
  },
  computed:
  {
    validNutriments()
    {
      const validKeys = Object.keys(Object.filterKeys(this.productInfo.nutriments, x => x.endsWith('_100g')))
      const validNutriments = validKeys.filter(x => this.validNutrimentNames.indexOf(x.replace('_100g', '')) > -1)
      return validNutriments
    }
  },
  mounted()
  {
    this.barcode = `${this.$route.query.id}`
    const checkSum = this.barcode.split('').reduce((p, v, i) => i % 2 == 0 ? p + 1 * v : p + 3 * v, 0);
    const isValid = checkSum % 10 == 0
    if(isValid)
    {
      this.getProduct(this.barcode)
    }
    else
    {
        this.isLoading = false
        this.$buefy.dialog.alert({
          title: 'Error',
          message: 'Invalid barcode, please scan the product again.',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          ariaRole: 'alertdialog',
          ariaModal: true,
          onConfirm: _ => { this.$router.push({ name: 'scanner'}) }
        })
    }
  }
}
</script>

<style>

  #product-image
  {
    max-height: 50vh;
    object-fit: contain;
  }

</style>