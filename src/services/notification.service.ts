import api from './api'

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  read: boolean
  createdAt: string
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>('/notifications')
  return data
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>('/notifications/unread')
  return data
}

export async function markNotificationRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/notifications/read-all')
}
