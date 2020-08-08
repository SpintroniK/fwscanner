<template>
  <div id="product">
    <article class="media" v-if="productInfo">
      <figure class="media-left">
        <p class="image is-64x64">
          <img :src="productInfo.image_front_url" />
        </p>
      </figure>
      <div class="media-content">
        {{barcode}}
        <div class="content">
          <p>
            <strong>${productData.product_name}</strong>
            <br />
            <small>${productData.generic_name}</small>
            <br />
            toto
            <b-progress :value="80" type="is-success" show-value></b-progress>
            toto
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-reply"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-retweet"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-heart"></i></span>
            </a>
          </div>
        </nav>
      </div>
      <div class="media-right">
      </div>
    </article>
  </div>
</template>

<script>
//       {
//   "energy-kj_unit": "kJ",
//   "carbohydrates_unit": "g",
//   "fiber": 3.5,
//   "saturated-fat_100g": 5.9,
//   "energy_100g": 2030,
//   "fiber_value": 3.5,
//   "nova-group": 4,
//   "nutrition-score-fr_serving": 15,
//   "carbohydrates_100g": 64,
//   "salt_unit": "g",
//   "saturated-fat": 5.9,
//   "saturated-fat_serving": 0.82,
//   "sodium_value": 0.08,
//   "fiber_100g": 3.5,
//   "energy": 2030,
//   "salt_serving": 0.0278,
//   "proteins_serving": 0.82,
//   "fruits-vegetables-nuts_serving": 4,
//   "sodium": 0.08,
//   "fruits-vegetables-nuts_unit": "g",
//   "fat_value": 22,
//   "sugars_value": 32,
//   "fat_serving": 3.06,
//   "energy_value": 2030,
//   "saturated-fat_unit": "g",
//   "carbohydrates": 64,
//   "proteins_unit": "g",
//   "salt": 0.2,
//   "energy_serving": 282,
//   "nova-group_serving": 4,
//   "energy-kj": 2030,
//   "fat_unit": "g",
//   "fruits-vegetables-nuts_value": 4,
//   "sodium_unit": "g",
//   "saturated-fat_value": 5.9,
//   "carbohydrates_value": 64,
//   "nutrition-score-fr": 15,
//   "sodium_100g": 0.08,
//   "nutrition-score-fr_100g": 15,
//   "fruits-vegetables-nuts_100g": 4,
//   "proteins_value": 5.9,
//   "sugars_unit": "g",
//   "energy-kj_serving": 282,
//   "salt_100g": 0.2,
//   "proteins_100g": 5.9,
//   "fiber_serving": 0.487,
//   "sugars": 32,
//   "sugars_serving": 4.45,
//   "sodium_serving": 0.0111,
//   "energy-kj_100g": 2030,
//   "fiber_unit": "g",
//   "nova-group_100g": 4,
//   "carbohydrates_serving": 8.9,
//   "fruits-vegetables-nuts": 4,
//   "sugars_100g": 32,
//   "energy_unit": "kJ",
//   "fat_100g": 22,
//   "fruits-vegetables-nuts-estimate-from-ingredients_100g": 4,
//   "salt_value": 0.2,
//   "fat": 22,
//   "energy-kj_value": 2030,
//   "proteins": 5.9
// }

export default {
  data()
  {
    return {
      barcode: '',
      productInfo: false
    }
  },
  methods:
  {
    async getProduct(id)
    {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${id}.json`)
      const data = await response.json()
      console.log(data.product)
      this.productInfo = data.product
    }
  },
  mounted()
  {
    this.barcode = this.$route.query.id
    this.getProduct(this.barcode)
  }
}
</script>

<style>

  #product
  {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }

</style>