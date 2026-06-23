<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerRider } from '@/services/auth.service'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const age = ref<number | null>(null)
const email = ref('')
const password = ref('')
const licensePlate = ref('')
const vehicleType = ref('')
const vehicleModel = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await registerRider({
      first_name: firstName.value,
      last_name: lastName.value,
      age: age.value as number,
      email: email.value,
      password: password.value,
      license_plate: licensePlate.value,
      vehicle_type: vehicleType.value,
      vehicle_model: vehicleModel.value,
      zone: 'ZONA_1',
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
      <label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1">
        Placa
      </label>
      <input
        id="licensePlate"
        v-model="licensePlate"
        type="text"
        required
        placeholder="P-001XYZ"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
      />
    </div>

    <div>
      <label for="vehicleType" class="block text-sm font-medium text-gray-700 mb-1">
        Tipo de vehículo
      </label>
      <select
        id="vehicleType"
        v-model="vehicleType"
        required
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
      >
        <option value="" disabled>Seleccioná un tipo</option>
        <option value="MOTO">Moto</option>
        <option value="CARRO">Carro</option>
        <option value="BICICLETA">Bicicleta</option>
      </select>
    </div>

    <div>
      <label for="vehicleModel" class="block text-sm font-medium text-gray-700 mb-1">
        Modelo del vehículo
      </label>
      <input
        id="vehicleModel"
        v-model="vehicleModel"
        type="text"
        required
        placeholder="Honda CB150"
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
