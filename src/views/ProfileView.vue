<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { UserProfile } from '@/types/auth.types'
import { getProfile } from '@/services/auth.service'

const router = useRouter()
const profile = ref<UserProfile | null>(null)
const errorMessage = ref('')

const initials = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.first_name[0]}${profile.value.last_name[0]}`.toUpperCase()
})

async function loadProfile() {
  try {
    profile.value = await getProfile()
  } catch {
    errorMessage.value = 'No se pudo cargar tu perfil.'
  }
}

function goBack() {
  if (profile.value?.role === 'RIDER') {
    router.push({ name: 'rider-board' })
  } else {
    router.push({ name: 'client-home' })
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow p-6 w-full max-w-md">
      <button @click="goBack" class="text-sm text-slate-500 mb-4 hover:text-slate-800">← Volver</button>

      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

      <template v-else-if="profile">
        <div class="flex flex-col items-center mb-6">
          <div class="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold mb-3">
            {{ initials }}
          </div>
          <h1 class="text-xl font-semibold">{{ profile.first_name }} {{ profile.last_name }}</h1>
          <span class="text-sm text-slate-500">{{ profile.role === 'RIDER' ? 'Repartidor' : 'Cliente' }}</span>
        </div>

        <div class="flex flex-col gap-2 text-sm">
          <p class="text-slate-500">Correo: <span class="text-slate-800">{{ profile.email }}</span></p>
          <p class="text-slate-500">Edad: <span class="text-slate-800">{{ profile.age }}</span></p>
          <p v-if="profile.role === 'RIDER'" class="text-slate-500">
            Vehículo: <span class="text-slate-800">{{ profile.vehicle }}</span>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
