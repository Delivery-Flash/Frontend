export type OrderStatus = 'AVAILABLE' | 'ACCEPTED' | 'DELIVERED'

export interface Rating {
  id: number
  orderId: number
  stars: number
  createdAt: string
}

export interface Order {
  id: number
  origin: string
  destination: string
  description?: string
  final_price?: string | null
  base_fare?: string | null
  zone: string
  status: OrderStatus
  clientId: number
  riderId?: number | null
  rating?: Rating | null
  createdAt: string
}

export interface RatingPayload {
  stars: number
  comment?: string
}
export interface CreateOrderPayload {
  origin: string
  destination: string
  description?: string
  distanceKm: number
}
