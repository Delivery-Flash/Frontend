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

const statusLabel: Record<string, string> = {
  AVAILABLE: 'En espera',
  ACCEPTED: 'Pedido aceptado un rider tomo el pedido',
  DELIVERED: 'El pedido fue entregado',
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}

async function loadOrders() {
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await orderService.getMyOrders()
    console.log('resultado:', result) 
    orders.value = result
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
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="max-w-6xl mx-auto">
      <header class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-teal-600 rounded flex items-center justify-center text-white font-bold">DF</div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800">Bienvenido a tu panel de cliente</h1>
        </div>

        <div class="flex items-center gap-3">
          <button @click="router.push({ name: 'create-order' })" class="bg-teal-600 text-white rounded-lg px-4 py-2 shadow-sm hover:bg-teal-700">+ Nuevo pedido</button>
          <button @click="router.push({ name: 'profile' })" class="bg-white text-teal-700 border border-teal-200 rounded-lg px-4 py-2 hover:bg-teal-50">Mi perfil</button>
          <button @click="handleLogout" class="bg-white text-slate-700 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50">Cerrar sesión</button>
        </div>
      </header>

      <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <p v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</p>
        <p v-if="loading" class="text-slate-600">Cargando tus pedidos...</p>
        <p v-else-if="orders.length === 0" class="text-slate-500">Aún no tienes pedidos. Crea el primero con el botón de arriba.</p>

        <div v-else class="grid gap-4">
          <div
            v-for="order in orders"
            :key="order.id"
            @click="goToOrder(order.id)"
            class="bg-slate-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ order.origin }} → {{ order.destination }}</p>
                <p class="text-sm text-slate-500">Q{{ parseFloat(order.final_price ?? order.base_fare ?? '0').toFixed(2) }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-amber-100 text-amber-700': order.status === 'AVAILABLE',
                  'bg-blue-100 text-blue-700': order.status === 'ACCEPTED',
                  'bg-emerald-100 text-emerald-700': order.status === 'DELIVERED',
                }"
              >{{ statusLabel[order.status] ?? order.status }}</span>
            </div>
            <p class="text-sm text-slate-500 mt-2">{{ order.description || 'Sin descripción' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
