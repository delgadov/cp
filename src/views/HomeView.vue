<script lang="ts">
import { ref, onMounted } from 'vue'
import { getAllAvailableProducts, moveProductToUser } from '@/services/ProductService.js'
import { isLoggedIn } from '@/services/AuthenticateService.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    LoaderComponent
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
      isLoadingPage
    }
  }
}
</script>

<template>
  <main>
    <div class="product-grid">
      <div v-if="isLoadingPage" class="product skeleton" v-for="i in 5">
        <div class="skeleton-img"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-description"></div>
        <div class="button-container">
          <div class="skeleton-button"></div>
        </div>
      </div>

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
    </div>
  </main>
</template>

<style scoped>
.product-grid ul {
  list-style-type: none;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
  gap: 1em;
}

@media (max-width: 92em) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 73em) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 54em) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 35em) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.product {
  height: 20em;
  width: 12em;
  padding: 2em;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease 0s;
}
@keyframes shimmer {
  0% {
    background-position: -12rem 0;
  }
  100% {
    background-position: 24rem 0;
  }
}

.product.skeleton {
  background: linear-gradient(to right, #fff 1%, #ccc 10%, #fff 20%);
  background-size: 400% 100%;
  animation: shimmer 1.5s linear infinite;
}
.skeleton-img {
  height: 9em;
  width: 12em;
  background-color: #e0e0e0;
}

.skeleton-title {
  height: 3em;
  width: 100%;
  margin-top: 1em;
  background-color: #e0e0e0;
}

.skeleton-description {
  height: 4.51rem;
  width: 100%;
  margin-top: 0.5em;
  background-color: #e0e0e0;
}

.skeleton-button {
  height: 2.5em;
  width: 8em;
  margin-top: 1em;
  width: 100%;
  background-color: #e0e0e0;
}
.product:hover {
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.2);
}

.product-img {
  height: 9em;
  width: 12em;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0;
}

.product-title {
  font-weight: bold;
  color: rgb(66, 70, 77);
  height: 3.5em;
  width: 100%;
  font-size: 0.875rem;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.product span {
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4.51rem;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 1rem;
  height: 3em;
}

.button-container button {
  display: inline-block;
  padding: 0.5em 1.5em;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #ff4081;
  border-radius: 0.5em;
  border: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.button-container button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
}

.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}
</style>
