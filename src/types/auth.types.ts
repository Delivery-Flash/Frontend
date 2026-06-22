export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterClientPayload {
  first_name: string
  last_name: string
  age: number
  email: string
  password: string
}

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface RegisterRiderPayload {
  first_name: string
  last_name: string
  age: number
  email: string
  password: string
  vehicle: string
}

export interface UserProfile {
  id: number
  first_name: string
  last_name: string
  age: number
  email: string
  role: string
  vehicle?: string | null
  createdAt: string
}

