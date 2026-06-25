import api from './api'
import type { LoginPayload, RegisterClientPayload, RegisterRiderPayload, UserProfile, LoginResponse, AuthUser } from '@/types/auth.types'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function registerClient(payload: RegisterClientPayload): Promise<AuthUser> {
  const { data } = await api.post<AuthUser>('/auth/register/client', payload)
  return data
}

export async function registerRider(payload: RegisterRiderPayload): Promise<AuthUser> {
  const { data } = await api.post<AuthUser>('/auth/register/rider', payload)
  return data
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/auth/me')
  return data
}

export async function updateProfilePhoto(photoUrl: string): Promise<void> {
  await api.patch('/auth/photo', { profile_photo: photoUrl })
}