<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerClient } from '@/services/auth.service'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const age = ref<number | null>(null)
const email = ref('')
const password = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await registerClient({
      first_name: firstName.value,
      last_name: lastName.value,
      age: age.value as number,
      email: email.value,
      password: password.value,
    })
    successMessage.value = '¡Cuenta creada! Redirigiendo...'
    setTimeout(() => router.push('/'), 1200)
  } catch (error) {
    errorMessage.value = 'No se pudo completar el registro'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
          Nombre(s)
        </label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          required
          placeholder="Juan"
          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
        />
      </div>
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
          Apellido(s)
        </label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          required
          placeholder="Pérez"
          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
        />
      </div>
    </div>

    <div>
      <label for="age" class="block text-sm font-medium text-gray-700 mb-1">
        Edad
      </label>
      <input
        id="age"
        v-model.number="age"
        type="number"
        required
        placeholder="22"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
        Correo
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        placeholder="tucorreo@ejemplo.com"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
        Contraseña
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        placeholder="Mínimo 8 caracteres, alfanumérica"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
      />
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="text-green-600 text-sm text-center font-medium">
      {{ successMessage }}
    </p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {{ loading ? 'Registrando...' : 'Registrarme' }}
    </button>
  </form>
</template>