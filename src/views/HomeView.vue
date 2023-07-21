<script lang="ts">
import { ref, watch } from 'vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useConnectionStore } from '@/store'
import Products from '@/components/Products.vue'
import { storeToRefs } from 'pinia'

export default {
  components: {
    SkeletonLoader,
    Products
  },
  data() {
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
      Products,
      isLoadingPage
    }
  }
}
</script>

<template>
  <main>
    <SkeletonLoader :isLoadingPage="isLoadingPage" />
    <Products />
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
