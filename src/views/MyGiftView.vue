<script lang="ts">
import { ref, onMounted } from 'vue'
import { getUserProducts, removeProductFromUser } from '@/services/ProductService.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useTokenStore } from '@/store'

export default {
  components: {
    LoaderComponent
  },
  data() {
    const gifts = ref<Array<{ id: any; title: string; description: string; encodedImage: string }>>(
      []
    )
    const isLoading = ref<Record<any, boolean>>({})
    const store = useTokenStore()
    const message = ref('')

    const getDecodedImage = (encodedImage: any) => {
      return `data:image/png;base64,${encodedImage}`
    }

    let email = localStorage.getItem('email')

    const fetchGifts = async () => {
      if (!email) {
        return
      }
      const response: any = await getUserProducts(email)
      gifts.value = response.data
    }

    onMounted(fetchGifts)

    onMounted(() => {
      if (!store.getIsLoggedIn) {
        message.value = 'Você não esta logado.'
      } else if (gifts.value.length == 0) {
        message.value = 'Você ainda não tem presentes.'
      } else {
        message.value = ''
      }
    })

    const removeGift = async (gift: { id: any }) => {
      isLoading.value[gift.id] = true

      removeProductFromUser(gift.id)
        .then(() => {
          gifts.value = gifts.value.filter((g) => g.id !== gift.id)
        })
        .catch((err: any) => {
          console.log(err)
        })
        .finally(() => {
          isLoading.value[gift.id] = false
        })
    }

    return {
      gifts,
      getDecodedImage,
      removeGift,
      isLoading,
      message
    }
  }
}
</script>

<template>
  <main>
    <div class="product-grid">
      <div v-if="message">{{ message }}</div>
      <div class="product" v-for="gift in gifts" :key="gift.id">
        <div class="product-img">
          <img :src="getDecodedImage(gift.encodedImage)" alt="Product Image" />
        </div>
        <h3 class="product-title">{{ gift.title }}</h3>
        <span>{{ gift.description }}</span>
        <div class="button-container">
          <button @click="removeGift(gift)" v-if="!isLoading[gift.id]">Remover</button>
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

.product:hover {
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.2);
}

.product-img {
  height: 9em;
  width: 12em;
}

.product-img img {
  width: 100%;
  height: 100%;
  padding: 0;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
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
  /* Pink */
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
