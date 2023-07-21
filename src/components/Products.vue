<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectionStore } from '@/store'
import { getAllAvailableProducts, moveProductToUser } from '@/services/ProductService.js'
import { isLoggedIn } from '@/services/AuthenticateService.js'
import LoaderComponent from './LoaderComponent.vue'

export default {
  components: {
    LoaderComponent
  },
  data() {
    const products: any = ref([])
    const isLoading: any = ref({})
    const router = useRouter()
    const store = useConnectionStore()

    const fetchProducts = async () => {
      store.setLoadingPage(true)
      const response: any = await getAllAvailableProducts()
      products.value = response.data
      store.setLoadingPage(false)
    }

    const getDecodedImage = (encodedImage: any) => {
      return `data:image/png;base64,${encodedImage}`
    }

    const gift = async (product: { id: string }) => {
      isLoading.value[product.id] = true

      const email = localStorage.getItem('email')
      const sessionToken = localStorage.getItem('sessionToken')

      if (email) {
        const loggedInRequest = {
          email,
          sessionToken: sessionToken || ''
        }

        isLoggedIn(loggedInRequest)
          .then((response: any) => {
            moveProductToUser(product.id, loggedInRequest.email)
              .then((response: any) => {
                products.value = products.value.filter((p: any) => p.id != product.id)
                isLoading.value[product.id] = false
              })
              .catch((err: any) => {
                console.log(err)
              })
          })
          .catch((err: any) => {
            router.push('/login')
          })
      } else {
        router.push('/login')
      }
    }

    onMounted(fetchProducts)

    return { products, getDecodedImage, gift, LoaderComponent, isLoading, store }
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
          <button @click="gift(product)" v-if="!isLoading[product.id]">Presentar</button>
          <LoaderComponent v-else />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@import '@/assets/product-style.css';
</style>
