import { defineStore } from 'pinia'

export const useTokenStore = defineStore('tokens', {
  state: () => ({
    isLoggedIn: false
  }),
  actions: {
    setLoggedIn(value: boolean) {
      this.isLoggedIn = value
    },
    getIsLoggedIn() {
      return this.isLoggedIn
    }
  }
})

export const useConnectionStore = defineStore('loading', {
  state: () => ({
    isLoadingPage: false
  }),
  actions: {
    setLoadingPage(value: boolean) {
      this.isLoadingPage = value
    },
    getLoadingPage() {
      return this.isLoadingPage
    }
  }
})
