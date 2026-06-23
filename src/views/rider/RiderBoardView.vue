<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders.store'
import { useAuthStore } from '@/stores/auth.store'
import { disconnectSocket } from '@/services/socket.service'
import OrderCard from '@/components/rider/OrderCard.vue'

const router = useRouter()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}

async function handleAccept(orderId: number) {
  try {
    await ordersStore.accept(orderId)
  } catch {
    ordersStore.errorMessage = 'Ese pedido ya no está disponible.'
    await ordersStore.fetchAvailableOrders()
  }
}

onMounted(() => {
  ordersStore.fetchAvailableOrders()
  ordersStore.fetchActiveOrder()
  ordersStore.fetchMyOrders()
  ordersStore.listenForUpdates()
})

onUnmounted(() => disconnectSocket())
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Tablero de pedidos</h1>
      <div class="flex gap-2">
        <button @click="router.push({ name: 'profile' })" class="bg-slate-200 text-slate-700 rounded-lg px-4 py-2">
          Mi perfil
        </button>
        <button @click="handleLogout" class="bg-slate-200 text-slate-700 rounded-lg px-4 py-2">
          Cerrar sesión
        </button>
      </div>
    </div>

    <div v-if="ordersStore.activeOrder" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <p class="font-medium mb-2">
        Pedido activo #{{ ordersStore.activeOrder.id }} — {{ ordersStore.activeOrder.status }}
      </p>

      <button
        v-if="ordersStore.activeOrder.status === 'ACCEPTED'"
        @click="ordersStore.deliver"
        class="bg-emerald-600 text-white rounded-lg px-4 py-2"
      >
        Marcar como entregado
      </button>

      <div v-if="ordersStore.activeOrder.status === 'DELIVERED'">
        <p v-if="ordersStore.activeOrder.rating" class="text-amber-500 font-medium">
          Calificación del cliente:
          {{ '★'.repeat(ordersStore.activeOrder.rating.stars) }}{{ '☆'.repeat(5 - ordersStore.activeOrder.rating.stars) }}
        </p>
        <p v-else class="text-slate-500 text-sm">Esperando la calificación del cliente...</p>
      </div>
    </div>

    <h2 class="text-lg font-semibold mb-3">Pedidos disponibles</h2>
    <p v-if="ordersStore.errorMessage" class="text-red-600 mb-4">{{ ordersStore.errorMessage }}</p>
    <p v-if="ordersStore.loading">Cargando pedidos...</p>
    <p v-else-if="ordersStore.availableOrders.length === 0" class="text-slate-500 mb-8">
      No hay pedidos disponibles por el momento.
    </p>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <OrderCard
        v-for="order in ordersStore.availableOrders"
        :key="order.id"
        :order="order"
        @accept="handleAccept"
      />
    </div>

    <h2 class="text-lg font-semibold mb-3">Historial de mis entregas</h2>
    <p v-if="ordersStore.myOrders.length === 0" class="text-slate-500">
      Aún no has aceptado ningún pedido.
    </p>
    <div v-else class="flex flex-col gap-3">
      <div v-for="order in ordersStore.myOrders" :key="order.id" class="bg-white rounded-xl shadow p-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ order.origin }} → {{ order.destination }}</p>
            <p class="text-sm text-slate-500">Q{{ parseFloat(order.final_price ?? order.base_fare ?? '0').toFixed(2) }}</p>          </div>
          <div class="text-right">
            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-700': order.status === 'ACCEPTED',
                'bg-emerald-100 text-emerald-700': order.status === 'DELIVERED',
              }"
            >{{ order.status }}</span>
            <p v-if="order.rating" class="text-amber-500 text-sm mt-1">
              {{ '★'.repeat(order.rating.stars) }}{{ '☆'.repeat(5 - order.rating.stars) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
