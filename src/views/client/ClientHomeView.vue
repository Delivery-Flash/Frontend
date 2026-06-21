<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import type { Order } from '@/types/order.types'
import * as orderService from '@/services/order.service'


const router = useRouter()
const authStore = useAuthStore()
const orders = ref<Order[]>([])
const loading = ref(false)
const errorMessage = ref('')

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}

async function loadOrders() {
  loading.value = true
  errorMessage.value = ''
  try {
    orders.value = await orderService.getMyOrders()
  } catch {
    errorMessage.value = 'No se pudieron cargar tus pedidos.'
  } finally {
    loading.value = false
  }
}

function goToOrder(id: number) {
  router.push({ name: 'order-tracking', params: { id } })
}

onMounted(loadOrders)
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Bienvenido a tu panel de cliente</h1>
      <button @click="router.push({ name: 'create-order' })" class="bg-teal-600 text-white rounded-lg px-4 py-2">
        + Nuevo pedido
      </button>
      <button @click="router.push({ name: 'profile' })" class="bg-slate-200 text-slate-700 rounded-lg px-4 py-2">
        Mi perfil
      </button>
      <button @click="handleLogout" class="bg-slate-200 text-slate-700 rounded-lg px-4 py-2">
      Cerrar sesión
    </button>
    </div>

    <p v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</p>
    <p v-if="loading">Cargando tus pedidos...</p>
    <p v-else-if="orders.length === 0" class="text-slate-500">
      Aún no tienes pedidos. Crea el primero con el botón de arriba.
    </p>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="order in orders"
        :key="order.id"
        @click="goToOrder(order.id)"
        class="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ order.origin }} → {{ order.destination }}</p>
            <p class="text-sm text-slate-500">Q{{ order.price.toFixed(2) }}</p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-amber-100 text-amber-700': order.status === 'AVAILABLE',
              'bg-blue-100 text-blue-700': order.status === 'ACCEPTED',
              'bg-emerald-100 text-emerald-700': order.status === 'DELIVERED',
            }"
          >{{ order.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
