<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { UserProfile } from '@/types/auth.types'
import { getProfile, updateProfilePhoto } from '@/services/auth.service'

const router = useRouter()
const profile = ref<UserProfile | null>(null)
const errorMessage = ref('')
const photoUrl = ref('')
const showPhotoForm = ref(false)
const photoLoading = ref(false)
const photoSuccess = ref(false)
const photoError = ref('')

const initials = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.first_name[0]}${profile.value.last_name[0]}`.toUpperCase()
})

const hasPhoto = computed(() => !!profile.value?.profile_photo)

async function loadProfile() {
  try {
    profile.value = await getProfile()
    photoUrl.value = profile.value.profile_photo ?? ''
  } catch {
    errorMessage.value = 'No se pudo cargar tu perfil.'
  }
}

async function savePhoto() {
  if (!photoUrl.value.trim()) {
    photoError.value = 'Ingresa una URL válida.'
    return
  }
  photoLoading.value = true
  photoError.value = ''
  photoSuccess.value = false
  try {
    await updateProfilePhoto(photoUrl.value.trim())
    if (profile.value) profile.value.profile_photo = photoUrl.value.trim()
    photoSuccess.value = true
    showPhotoForm.value = false
  } catch {
    photoError.value = 'No se pudo actualizar la foto. Verifica la URL.'
  } finally {
    photoLoading.value = false
  }
}

function goBack() {
  if (profile.value?.role === 'RIDER') {
    router.push({ name: 'rider-board' })
  } else if (profile.value?.role === 'ADMIN') {
    router.push({ name: 'admin-dashboard' })
  } else {
    router.push({ name: 'client-home' })
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden flex items-center justify-center p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <button @click="goBack" class="text-sm text-slate-500 mb-5 hover:text-teal-700 flex items-center gap-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <p v-if="errorMessage" class="text-red-600 text-sm mb-4">{{ errorMessage }}</p>

        <template v-else-if="profile">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-6">
            <div class="relative group mb-3">
              <img
                v-if="hasPhoto"
                :src="profile.profile_photo!"
                :alt="`${profile.first_name} ${profile.last_name}`"
                class="w-24 h-24 rounded-full object-cover ring-4 ring-teal-100"
                @error="profile!.profile_photo = null"
              />
              <div v-else class="w-24 h-24 rounded-full bg-teal-600 text-white flex items-center justify-center text-3xl font-bold ring-4 ring-teal-100">
                {{ initials }}
              </div>
              <button
                @click="showPhotoForm = !showPhotoForm"
                class="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-teal-700 transition-colors"
                title="Cambiar foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <h1 class="text-xl font-bold text-gray-800">{{ profile.first_name }} {{ profile.last_name }}</h1>
            <span
              class="mt-1 text-xs font-semibold px-3 py-1 rounded-full"
              :class="{
                'bg-teal-100 text-teal-700': profile.role === 'CLIENT',
                'bg-blue-100 text-blue-700': profile.role === 'RIDER',
                'bg-purple-100 text-purple-700': profile.role === 'ADMIN',
              }"
            >
              {{ profile.role === 'RIDER' ? 'Repartidor' : profile.role === 'ADMIN' ? 'Administrador' : 'Cliente' }}
            </span>
          </div>

          <!-- Formulario de foto -->
          <Transition name="fade">
            <div v-if="showPhotoForm" class="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
              <p class="text-sm font-medium text-gray-700 mb-2">URL de la nueva foto de perfil</p>
              <input
                v-model="photoUrl"
                type="url"
                placeholder="https://ejemplo.com/foto.jpg"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 mb-3"
              />
              <p v-if="photoError" class="text-red-500 text-xs mb-2">{{ photoError }}</p>
              <div class="flex gap-2">
                <button
                  @click="savePhoto"
                  :disabled="photoLoading"
                  class="flex-1 bg-teal-600 text-white text-sm rounded-lg py-2 font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {{ photoLoading ? 'Guardando...' : 'Guardar foto' }}
                </button>
                <button
                  @click="showPhotoForm = false; photoError = ''"
                  class="flex-1 bg-white text-slate-600 border border-slate-200 text-sm rounded-lg py-2 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Transition>

          <p v-if="photoSuccess" class="text-emerald-600 text-sm text-center mb-4">¡Foto actualizada correctamente!</p>

          <!-- Datos del perfil -->
          <div class="flex flex-col gap-3 text-sm">
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-xs text-slate-400">Correo</p>
                <p class="text-slate-800 font-medium">{{ profile.email }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-xs text-slate-400">Edad</p>
                <p class="text-slate-800 font-medium">{{ profile.age }} años</p>
              </div>
            </div>

            <div v-if="profile.role === 'RIDER'" class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <div>
                <p class="text-xs text-slate-400">Vehículo</p>
                <p class="text-slate-800 font-medium">{{ profile.vehicle || 'No especificado' }}</p>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex justify-center py-10">
            <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>