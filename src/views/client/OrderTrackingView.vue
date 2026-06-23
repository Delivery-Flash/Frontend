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
    rated.value = !!order.value.rating 
  } catch {
    errorMessage.value = 'No se encontró el pedido.'
  }
}

// rating + comment are handled inside RatingStars component

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
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden flex items-center justify-center p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <button @click="router.push({ name: 'client-home' })" class="bg-white text-teal-700 border border-teal-200 px-4 py-2 rounded-lg font-medium hover:bg-teal-50">
            ← Volver
          </button>
          <span class="text-sm text-gray-500">Pedido #{{ order?.id ?? '—' }}</span>
        </div>

        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

        <template v-else-if="order">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-800 mb-2">Detalles</h2>
              <p class="text-sm text-slate-500 mb-1">Origen: {{ order.origin }}</p>
              <p class="text-sm text-slate-500 mb-1">Destino: {{ order.destination }}</p>
              <p class="text-sm text-slate-500 mb-4">Precio: Q{{ parseFloat(order.final_price ?? order.base_fare ?? '0').toFixed(2) }}</p>

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
              <div v-if="order.status === 'DELIVERED' && rated" class="mt-6 text-emerald-600">
                ¡Gracias por tu calificación!
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold text-gray-800 mb-2">Información adicional</h2>
              <p class="text-sm text-slate-500 mb-2">{{ order.description || 'No hay descripción del paquete.' }}</p>
              <p class="text-sm text-slate-500">Creado: {{ new Date(order.createdAt).toLocaleString() }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="text-slate-500">Cargando información del pedido...</p>
        </template>
      </div>
    </div>
  </div>
</template>
