import api from './api'

export interface Earning {
  id: number
  orderId: number
  riderId: number
  amount: string
  createdAt: string
  order?: {
    origin: string
    destination: string
  }
}

export interface EarningsSummary {
  total: string | number
  count: number
  average?: string | number
}

export interface AdminEarningsSummary {
  totalPlatform: string | number
  totalRiders: string | number
  totalOrders: number
}

export async function getMyEarnings(): Promise<Earning[]> {
  const { data } = await api.get<Earning[]>('/earnings/mine')
  return data
}

export async function getMyEarningsSummary(): Promise<EarningsSummary> {
  const { data } = await api.get<EarningsSummary>('/earnings/mine/summary')
  return data
}

export async function getGlobalEarningsSummary(): Promise<AdminEarningsSummary> {
  const { data } = await api.get<AdminEarningsSummary>('/earnings/summary')
  return data
}
