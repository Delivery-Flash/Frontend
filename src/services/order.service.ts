import api from './api'
import type { Order, RatingPayload, CreateOrderPayload } from '@/types/order.types'


export async function getAvailableOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/available')
  return data
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`)
  return data
}

export async function acceptOrder(id: number): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/accept`)
  return data
}

export async function markDelivered(id: number): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/deliver`)
  return data
}

export async function rateOrder(id: number, payload: RatingPayload): Promise<void> {
  await api.post(`/orders/${id}/rating`, payload)
}



export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload)
  return data
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/mine')
  return data
}

export async function getMyActiveOrder(): Promise<Order | null> {
  const { data } = await api.get<Order | null>('/orders/rider/active')
  return data
}

export async function getMyRiderOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/rider/mine')
  return data
}

