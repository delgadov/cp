import './assets/main.css'

import { createApp } from 'vue'
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: '380434910139-791ss2d7k6jrdd9i6tm5e2i45pndcqu0.apps.googleusercontent.com'
})

app.mount('#app')
