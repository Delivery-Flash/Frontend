import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterClientView from '@/views/auth/RegisterClientView.vue'
import HommePageView from '@/views/HommePageView.vue'
import ClientHomeView from '@/views/client/ClientHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HommePageView, 
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register/client',
      name: 'register-client',
      component: RegisterClientView,
    },
    { // VISTA QUE SE REDIRIGIRA AL PANEL JSJS
      path: '/client/home',
      name: 'client-home',
      component: ClientHomeView,
    }
  ],
})

export default router
