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
  license_plate: string
  vehicle_type: string
  vehicle_model: string
  zone: string
}

export interface UserProfile {
  id: number
  first_name: string
  last_name: string
  age: number
  email: string
  role: string
  vehicle?: string | null
  profile_photo?: string | null
  createdAt: string
}

export interface VehicleProfile {
  // "license_plate": "p-001abc",
  // "vehicle_type": "BICICLETA",
  // "vehicle_model": "hona",
  // "is_verified": false,
  // "createdAt": "2026-06-25T23:15:30.877Z"
  license_plate: string | null
  vehicle_type: string | null
  vehicle_model: string | null
  is_verified: boolean | null
  createdAt: string | number | Date
}