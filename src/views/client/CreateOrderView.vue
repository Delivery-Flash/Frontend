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
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden flex items-center justify-center p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="w-full max-w-2xl">
      <div class="flex items-start gap-6 mb-6">
        <div class="w-12 h-12 bg-teal-600 rounded flex items-center justify-center text-white font-bold">DF</div>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800">Nuevo pedido</h1>
          <p class="text-sm text-gray-500 mt-1">Completa los datos para solicitar un envío rápido y confiable.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-3">
            <input v-model="origin" type="text" placeholder="Origen" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-100" />
            <input v-model="destination" type="text" placeholder="Destino" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-100" />
            <textarea v-model="description" placeholder="Descripción del paquete (opcional)" class="border rounded-lg px-3 py-2 h-24 resize-none" />
            <input v-model.number="distanceKm" type="number" min="0.1" step="0.1" placeholder="Distancia (km)" class="border rounded-lg px-3 py-2" />
          </div>

          <div class="flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Resumen</h3>
              <p class="text-sm text-gray-500 mt-2">Revisa los datos antes de enviar tu solicitud.</p>

              <ul class="mt-4 text-sm text-gray-600 space-y-2">
                <li><span class="font-medium text-gray-800">Origen:</span> <span class="ml-2">{{ origin || '—' }}</span></li>
                <li><span class="font-medium text-gray-800">Destino:</span> <span class="ml-2">{{ destination || '—' }}</span></li>
                <li><span class="font-medium text-gray-800">Distancia:</span> <span class="ml-2">{{ distanceKm ? distanceKm + ' km' : '—' }}</span></li>
              </ul>
            </div>

            <div class="mt-4">
              <p class="text-sm text-slate-500">Precio sugerido:</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-2xl font-extrabold text-teal-600">Q{{ suggestedPrice }}</span>
                <button @click="submit" :disabled="loading" class="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50">
                  {{ loading ? 'Creando...' : 'Solicitar envío' }}
                </button>
              </div>
              <p v-if="errorMessage" class="text-red-600 text-sm mt-3">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
