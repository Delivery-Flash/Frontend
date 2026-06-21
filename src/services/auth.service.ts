import api from './api'
import type { LoginPayload, RegisterClientPayload, LoginResponse, AuthUser } from '@/types/auth.types'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function registerClient(payload: RegisterClientPayload): Promise<AuthUser> {
  const { data } = await api.post<AuthUser>('/auth/register/client', payload)
  return data
}