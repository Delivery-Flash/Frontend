<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

const emit = defineEmits<{
  success: []
}>()

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await login({ email: email.value, password: password.value })
    authStore.setSession(response.accessToken, response.user)
    emit('success')
    router.push('/client/home')
  } catch (error) {
    errorMessage.value = 'Credenciales inválidas. Verifica tu correo y contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="relative">
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 7l-9 6L3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="tucorreo@ejemplo.com"
          class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all shadow-sm"
        />
      </div>
    </div>

    <div class="relative">
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all shadow-sm"
        />
      </div>
    </div>

    <!-- <div class="flex items-center justify-between text-sm">
    </div> -->

    <p v-if="errorMessage" class="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
      {{ errorMessage }}
    </p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ loading ? 'Ingresando...' : 'Ingresar' }}
    </button>
  </form>
</template>
