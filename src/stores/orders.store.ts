import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types/order.types'
import * as orderService from '@/services/order.service'
import { connectSocket } from '@/services/socket.service'

export const useOrdersStore = defineStore('orders', () => {
  const availableOrders = ref<Order[]>([])
  const activeOrder = ref<Order | null>(null)
  const myOrders = ref<Order[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function fetchAvailableOrders() {
    loading.value = true
    errorMessage.value = ''
    try {
      availableOrders.value = await orderService.getAvailableOrders()
      console.log('availableOrders:', availableOrders.value)
    } catch {
      errorMessage.value = 'No se pudieron cargar los pedidos disponibles.'
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveOrder() {
    activeOrder.value = await orderService.getMyActiveOrder()
  }

  async function fetchMyOrders() {
    myOrders.value = await orderService.getMyRiderOrders()
  }

  async function accept(orderId: number) {
    const order = await orderService.acceptOrder(orderId)
    availableOrders.value = availableOrders.value.filter((o) => o.id !== orderId)
    activeOrder.value = order
    myOrders.value = [order, ...myOrders.value]
  }

  async function deliver() {
    if (!activeOrder.value) return
    activeOrder.value = await orderService.markDelivered(activeOrder.value.id)
    myOrders.value = myOrders.value.map((o) => (o.id === activeOrder.value!.id ? activeOrder.value! : o))
  }

  function listenForUpdates() {
    const socket = connectSocket()
    socket.on('order:updated', (updated: Order) => {
      if (activeOrder.value?.id === updated.id) activeOrder.value = updated
      availableOrders.value = availableOrders.value.filter((o) => o.id !== updated.id)
      myOrders.value = myOrders.value.map((o) => (o.id === updated.id ? updated : o))
    })
  }
  

  return {
    availableOrders,
    activeOrder,
    myOrders,
    loading,
    errorMessage,
    fetchAvailableOrders,
    fetchActiveOrder,
    fetchMyOrders,
    accept,
    deliver,
    listenForUpdates,
  }
})
