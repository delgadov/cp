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
