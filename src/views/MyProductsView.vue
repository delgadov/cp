<script lang="ts">
import { ref, watch } from 'vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useConnectionStore } from '@/store'
import MyProducts from '@/components/MyProducts.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    SkeletonLoader,
    MyProducts
  },
  data() {
    const email = localStorage.getItem('email')
    const sessionToken = localStorage.getItem('sessionToken')

    if (!email && !sessionToken) {
      const router = useRouter()
      router.push('/login')
    }

    const store = useConnectionStore()

    const isLoadingPage = ref(false)

    watch(
      () => store.getLoadingPage(),
      (newState: boolean) => {
        isLoadingPage.value = newState
      }
    )

    return {
      SkeletonLoader,
      MyProducts,
      isLoadingPage
    }
  }
}
</script>

<template>
  <main>
    <SkeletonLoader :isLoadingPage="isLoadingPage" />
    <MyProducts />
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
