<script setup lang="ts">
import { ref } from 'vue'
import * as orderService from '@/services/order.service'

const props = defineProps<{ orderId: number }>()
const emit = defineEmits<{ rated: [] }>()

const stars = ref(0)
const errorMessage = ref('')
const loading = ref(false)

async function submit() {
  if (stars.value < 1) {
    errorMessage.value = 'Selecciona al menos una estrella.'
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    await orderService.rateOrder(props.orderId, { stars: stars.value })
    emit('rated')
  } catch {
    errorMessage.value = 'No se pudo enviar la calificación.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <p class="text-sm text-slate-600 mb-2">Califica el servicio del repartidor</p>
    <div class="flex gap-1 mb-3">
      <button
        v-for="n in 5"
        :key="n"
        type="button"
        @click="stars = n"
        class="text-2xl"
        :class="n <= stars ? 'text-amber-400' : 'text-slate-300'"
      >★</button>
    </div>
    <p v-if="errorMessage" class="text-red-600 text-sm mb-2">{{ errorMessage }}</p>
    <button @click="submit" :disabled="loading" class="w-full bg-teal-600 text-white rounded-lg py-2 disabled:opacity-50">
      {{ loading ? 'Enviando...' : 'Enviar calificación' }}
    </button>
  </div>
</template>
