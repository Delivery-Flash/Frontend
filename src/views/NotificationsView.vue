<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import * as notificationService from '@/services/notification.service'
import type { Notification } from '@/services/notification.service'

const router = useRouter()
const authStore = useAuthStore()
const notifications = ref<Notification[]>([])
const loading = ref(false)
const errorMessage = ref('')
const markingAll = ref(false)

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function goBack() {
  if (authStore.user?.role === 'RIDER') {
    router.push({ name: 'rider-board' })
  } else {
    router.push({ name: 'client-home' })
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function loadNotifications() {
  loading.value = true
  errorMessage.value = ''
  try {
    notifications.value = await notificationService.getNotifications()
  } catch {
    errorMessage.value = 'No se pudieron cargar las notificaciones.'
  } finally {
    loading.value = false
  }
}

async function markOneRead(notification: Notification) {
  if (notification.read) return
  try {
    await notificationService.markNotificationRead(notification.id)
    notification.read = true
  } catch {
    // silent fail — UI is already updated optimistically
  }
}

async function markAllRead() {
  if (unreadCount.value === 0) return
  markingAll.value = true
  try {
    await notificationService.markAllNotificationsRead()
    notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
  } catch {
    errorMessage.value = 'No se pudieron marcar todas como leídas.'
  } finally {
    markingAll.value = false
  }
}

onMounted(loadNotifications)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <header class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button @click="goBack" class="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-extrabold text-gray-800">Notificaciones</h1>
            <p v-if="unreadCount > 0" class="text-sm text-teal-600 font-medium">{{ unreadCount }} sin leer</p>
            <p v-else class="text-sm text-slate-400">Todas leídas</p>
          </div>
        </div>

        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          :disabled="markingAll"
          class="text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 px-4 py-2 rounded-lg hover:bg-teal-100 disabled:opacity-50 transition-colors"
        >
          {{ markingAll ? 'Marcando...' : 'Marcar todas como leídas' }}
        </button>
      </header>

      <!-- Error -->
      <p v-if="errorMessage" class="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {{ errorMessage }}
      </p>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="notifications.length === 0" class="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p class="text-slate-500 font-medium">Sin notificaciones</p>
        <p class="text-slate-400 text-sm mt-1">Aquí aparecerán las actualizaciones de tus pedidos.</p>
      </div>

      <!-- Notifications list -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          @click="markOneRead(notif)"
          class="bg-white rounded-xl shadow border transition-all cursor-pointer hover:shadow-md"
          :class="notif.read ? 'border-slate-100' : 'border-teal-200'"
        >
          <div class="p-4 flex gap-4 items-start">
            <!-- Dot indicator -->
            <div class="mt-1 shrink-0">
              <div v-if="!notif.read" class="w-2.5 h-2.5 bg-teal-500 rounded-full"></div>
              <div v-else class="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-gray-800" :class="{ 'font-medium text-slate-600': notif.read }">
                  {{ notif.title }}
                </p>
                <span class="text-xs text-slate-400 shrink-0 mt-0.5">{{ formatDate(notif.createdAt) }}</span>
              </div>
              <p class="text-sm text-slate-500 mt-1 leading-relaxed">{{ notif.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
