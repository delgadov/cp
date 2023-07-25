<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectionStore } from '@/store'
import { getAllAvailableProducts, moveProductToUser } from '@/services/ProductService.js'
import { isLoggedIn } from '@/services/AuthenticateService.js'
import LoaderComponent from './LoaderComponent.vue'
import PopUp from './PopUp.vue'

export default {
  components: {
    PopUp
  },
  data() {
    const products: any = ref([])
    const store = useConnectionStore()
    const showPopup = ref(false)
    const selectedProduct = ref(Object)

    const openPopup = (product: any) => {
      selectedProduct.value = product
      showPopup.value = true
    }

    const closePopup = () => {
      showPopup.value = false
    }

    const fetchProducts = async () => {
      store.setLoadingPage(true)
      const response: any = await getAllAvailableProducts()

      products.value = response.data
      store.setLoadingPage(false)
    }

    const getDecodedImage = (encodedImage: any) => {
      return `data:image/png;base64,${encodedImage}`
    }

    const moveCompleted = (id: string) => {
      products.value = products.value.filter((p: any) => p.id != id)
      showPopup.value = false
    }

    onMounted(fetchProducts)

    return {
      products,
      getDecodedImage,
      store,
      openPopup,
      closePopup,
      showPopup,
      selectedProduct,
      moveCompleted
    }
  }
}
</script>

<template>
  <div class="product-grid">
    <TransitionGroup name="product-fade">
      <div class="product loading" v-for="product in products" :key="product.id">
        <div class="product-img">
          <img :src="getDecodedImage(product.encodedImage)" alt="Product Image" />
        </div>
        <h3 class="product-title">{{ product.title }}</h3>
        <span>{{ product.description }}</span>
        <div class="button-container">
          <button @click="openPopup(product)">Presentar</button>
        </div>
      </div>
    </TransitionGroup>
    <PopUp
      v-if="showPopup"
      :product="selectedProduct"
      @close="closePopup"
      @completed="moveCompleted"
    />
  </div>
</template>

<style scoped>
@import '@/assets/product-style.css';
</style>
