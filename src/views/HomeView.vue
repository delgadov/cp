<script lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getAllAvailableProducts, moveProductToUser } from '@/services/ProductService.js'
import { isLoggedIn } from '@/services/AuthenticateService.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useRouter } from 'vue-router'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

export default {
  components: {
    LoaderComponent,
    SkeletonLoader
  },
  data() {
    const products: any = ref([])
    const isLoading: any = ref({})
    const isLoadingPage = ref(false)
    const router = useRouter()

    const fetchProducts = async () => {
      const response: any = await getAllAvailableProducts()
      products.value = response.data
      isLoadingPage.value = false
    }

    onMounted(fetchProducts)
    onMounted(() => {
      isLoadingPage.value = true
    })

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

    return {
      products,
      getDecodedImage,
      gift,
      LoaderComponent,
      isLoading,
      isLoadingPage,
      SkeletonLoader
    }
  }
}
</script>

<template>
  <main>
    <div class="product-grid">
      <SkeletonLoader :isLoadingPage="isLoadingPage" />
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
  </main>
</template>

<style scoped>
@import url('@/assets/product-style.css');
.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}
</style>
