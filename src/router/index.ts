import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeViewVue from '@/views/HomeView.vue'
import CreateAccount from '@/views/CreateAccountView.vue'
import AdminView from '@/views/AdminView.vue'
import MyProductsView from '@/views/MyProductsView.vue'

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
      path: '/my-products',
      name: 'my-products',
      component: MyProductsView
    }
  ]
})
export default router
