<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectionStore } from '@/store'
import { getUserProducts, removeProductFromUser } from '@/services/ProductService.js'
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
    const noProductMsg = ref('')

    const email = localStorage.getItem('email')

    const fetchProducts = async () => {
      store.setLoadingPage(true)

      if (!email) {
        return
      }

      const response: any = await getUserProducts(email)
      products.value = response.data

      if (products.value.length === 0) {
        noProductMsg.value = 'Você ainda não tem presentes'
      } else {
        noProductMsg.value = ''
      }

      store.setLoadingPage(false)
    }

    const getDecodedImage = (encodedImage: any) => {
      return `data:image/png;base64,${encodedImage}`
    }

    const removeProduct = async (product: { id: string }) => {
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
            removeProductFromUser(product.id)
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

    return {
      products,
      getDecodedImage,
      removeProduct,
      LoaderComponent,
      isLoading,
      store,
      noProductMsg
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
          <button @click="removeProduct(product)" v-if="!isLoading[product.id]">Remover</button>
          <LoaderComponent v-else />
        </div>
      </div>
    </TransitionGroup>
  </div>
  <h3 class="empty-message" v-if="noProductMsg">{{ noProductMsg }}</h3>
</template>

<style scoped>
@import '@/assets/product-style.css';
.empty-message {
  /* Adjust the margin and padding as needed */
  margin: 0;
  padding: 1rem;
  font-size: 1rem;
  color: #555;
  width: 100%;
  text-align: center;
}
</style>
