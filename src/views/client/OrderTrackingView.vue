<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Order } from '@/types/order.types'
import * as orderService from '@/services/order.service'
import { connectSocket, disconnectSocket } from '@/services/socket.service'
import RatingStars from '@/components/client/RatingStars.vue'

const route = useRoute()
const router = useRouter()
const orderId = Number(route.params.id)

const order = ref<Order | null>(null)
const errorMessage = ref('')
const rated = ref(false)

async function loadOrder() {
  try {
    order.value = await orderService.getOrder(orderId)
  } catch {
    errorMessage.value = 'No se encontró el pedido.'
  }
}

onMounted(() => {
  loadOrder()
  const socket = connectSocket()
  socket.on('order:updated', (updated: Order) => {
    if (updated.id === orderId) order.value = updated
  })
})

onUnmounted(() => disconnectSocket())
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow p-6 w-full max-w-md">
        
        <button @click="router.push({ name: 'client-home' })" class="text-sm text-slate-500 mb-4 hover:text-slate-800">
        ← Volver
        </button>
      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

      <template v-else-if="order">
        <h1 class="text-xl font-semibold mb-4">Pedido #{{ order.id }}</h1>
        <p class="text-sm text-slate-500 mb-1">Origen: {{ order.origin }}</p>
        <p class="text-sm text-slate-500 mb-1">Destino: {{ order.destination }}</p>
        <p class="text-sm text-slate-500 mb-4">Precio: Q{{ order.price.toFixed(2) }}</p>

        <span
          class="inline-block px-3 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-amber-100 text-amber-700': order.status === 'AVAILABLE',
            'bg-blue-100 text-blue-700': order.status === 'ACCEPTED',
            'bg-emerald-100 text-emerald-700': order.status === 'DELIVERED',
          }"
        >{{ order.status }}</span>

        <div v-if="order.status === 'DELIVERED' && !rated" class="mt-6">
          <RatingStars :order-id="order.id" @rated="rated = true" />
        </div>
        <p v-else-if="rated" class="mt-6 text-emerald-600">¡Gracias por tu calificación!</p>
      </template>
    </div>
  </div>
</template>
