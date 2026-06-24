import api from './api'

export interface AdminUser {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  createdAt: string
  verified?: boolean
}

export interface PendingRider {
  id: number
  first_name: string
  last_name: string
  email: string
  license_plate?: string
  vehicle_type?: string
  vehicle_model?: string
  zone?: string
  createdAt: string
}

export interface OrdersReport {
  total: number
  available: number
  accepted: number
  delivered: number
}

export interface EarningsReport {
  totalRevenue: string | number
  totalOrders: number
  averageOrderValue?: string | number
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/admin/users')
  return data
}

export async function getPendingRiders(): Promise<PendingRider[]> {
  const { data } = await api.get<PendingRider[]>('/admin/riders/pending')
  return data
}

export async function verifyRider(riderId: number): Promise<void> {
  await api.patch(`/admin/riders/${riderId}/verify`)
}

export async function getOrdersReport(): Promise<OrdersReport> {
  const { data } = await api.get<OrdersReport>('/admin/reports/orders')
  return data
}

export async function getEarningsReport(): Promise<EarningsReport> {
  const { data } = await api.get<EarningsReport>('/admin/reports/earnings')
  return data
}
