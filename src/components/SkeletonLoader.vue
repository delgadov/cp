<script lang="ts">
import { ref, onMounted, watch } from 'vue'

export default {
  props: {
    isLoadingPage: Boolean
  },
  data() {
    const windowSize = ref(window.innerWidth)

    onMounted(() => {
      window.addEventListener('resize', () => {
        windowSize.value = window.innerWidth
      })
    })

    function toEm(value: number) {
      return value * 16
    }

    function calculateNumberOfSkeletons() {
      if (window.innerWidth > toEm(92)) {
        return 5
      }
      if (window.innerWidth > toEm(73)) {
        return 4
      }
      if (window.innerWidth > toEm(54)) {
        return 3
      }
      if (window.innerWidth > toEm(35)) {
        return 2
      }
      return 1
    }

    const numberOfSkeletons = ref(calculateNumberOfSkeletons())
    watch(windowSize, () => {
      numberOfSkeletons.value = calculateNumberOfSkeletons()
    })

    return {
      numberOfSkeletons
    }
  }
}
</script>

<template>
  <div v-if="isLoadingPage" class="product skeleton" v-for="i in numberOfSkeletons">
    <div class="skeleton-img"></div>
    <div class="skeleton-title"></div>
    <div class="skeleton-description"></div>
    <div class="button-container">
      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/product-style.css';

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
</style>
