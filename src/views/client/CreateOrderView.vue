<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as orderService from '@/services/order.service'

const router = useRouter()

const origin = ref('')
const destination = ref('')
const description = ref('')
const distanceKm = ref<number | null>(null)

const errorMessage = ref('')
const loading = ref(false)

const suggestedPrice = computed(() => ((distanceKm.value ?? 0) * 5).toFixed(2))

async function submit() {
  if (!origin.value || !destination.value || !distanceKm.value) {
    errorMessage.value = 'Completa origen, destino y distancia.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    const order = await orderService.createOrder({
      origin: origin.value,
      destination: destination.value,
      description: description.value || undefined,
      distanceKm: distanceKm.value,
    })
    router.push({ name: 'order-tracking', params: { id: order.id } })
    router.push({ name: 'client-home' })
  } catch {
    errorMessage.value = 'No se pudo crear el pedido.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow p-6 w-full max-w-md">
      <h1 class="text-xl font-semibold mb-4">Nuevo pedido</h1>

      <div class="flex flex-col gap-3">
        <input v-model="origin" type="text" placeholder="Origen" class="border rounded-lg px-3 py-2" />
        <input v-model="destination" type="text" placeholder="Destino" class="border rounded-lg px-3 py-2" />
        <textarea v-model="description" placeholder="Descripción del paquete (opcional)" class="border rounded-lg px-3 py-2" />
        <input v-model.number="distanceKm" type="number" min="0.1" step="0.1" placeholder="Distancia (km)" class="border rounded-lg px-3 py-2" />

        <p class="text-sm text-slate-500">Precio sugerido: <span class="font-medium text-slate-800">Q{{ suggestedPrice }}</span></p>

        <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>

        <button @click="submit" :disabled="loading" class="bg-teal-600 text-white rounded-lg py-2 disabled:opacity-50">
          {{ loading ? 'Creando...' : 'Solicitar envío' }}
        </button>
      </div>
    </div>
  </div>
</template>
