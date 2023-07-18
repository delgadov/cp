import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeViewVue from '@/views/HomeView.vue'
import CreateAccount from '@/views/CreateAccountView.vue'
import AdminView from '@/views/AdminView.vue'
import MyGiftView from '@/views/MyGiftView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViewVue
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccount
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/myGift',
      name: 'myGift',
      component: MyGiftView
    }
  ]
})
export default router
