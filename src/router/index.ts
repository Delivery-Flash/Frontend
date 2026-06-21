import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterClientView from '@/views/auth/RegisterClientView.vue'
import HommePageView from '@/views/HommePageView.vue'
import ClientHomeView from '@/views/client/ClientHomeView.vue'
import RiderBoardView from '@/views/rider/RiderBoardView.vue'
import OrderTrackingView from '@/views/client/OrderTrackingView.vue'
import { useAuthStore } from '@/stores/auth.store'
import CreateOrderView from '@/views/client/CreateOrderView.vue'
import RegisterRiderView from '@/views/auth/RegisterRiderView.vue'
import ProfileView from '@/views/ProfileView.vue'




declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: 'CLIENT' | 'RIDER' | 'ADMIN'
  }
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/rider/board',
      name: 'rider-board',
      component: RiderBoardView,
      meta: { requiresAuth: true, role: 'RIDER' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },

    {
      path: '/register/driver',
      name: 'register-driver',
      component: RegisterRiderView,
    },
    {
      path: '/client/orders/:id',
      name: 'order-tracking',
      component: OrderTrackingView,
      meta: { requiresAuth: true, role: 'CLIENT' },
    },
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
      path: '/client/orders/new',
      name: 'create-order',
      component: CreateOrderView,
      meta: { requiresAuth: true, role: 'CLIENT' },
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

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return { name: 'login' }
  if (to.meta.role && auth.user?.role !== to.meta.role) return { name: 'home' }
})

export default router
