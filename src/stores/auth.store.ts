// src/stores/auth.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUser } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<AuthUser | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  function setSession(accessToken: string, userData: AuthUser) {
    token.value = accessToken
    user.value = userData

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { token, user, setSession, logout }
})