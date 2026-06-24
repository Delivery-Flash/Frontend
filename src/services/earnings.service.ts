import api from './api'

export interface Earning {
  id: number
  orderId: number
  riderId: number
  amount: string
  net_amount: string | number
  gross_amount: string | number
  createdAt: string
  platform_fee: string | number
  order?: {
    origin: string
    destination: string
  }
}

export interface EarningsSummary {
  total: string | number
  count: number
  average?: string | number

  total_trips: number
  total_gross: string | number
  total_fees: string | number
  total_earned: string | number
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
