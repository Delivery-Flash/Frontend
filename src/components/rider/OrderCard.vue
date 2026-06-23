<script setup lang="ts">
import type { Order } from '@/types/order.types'

defineProps<{ order: Order }>()
const emit = defineEmits<{ accept: [orderId: number] }>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
    <p class="text-sm text-slate-500">Origen: <span class="text-slate-800">{{ order.origin }}</span></p>
    <p class="text-sm text-slate-500">Destino: <span class="text-slate-800">{{ order.destination }}</span></p>
    <p class="text-sm text-slate-500">Precio sugerido: <span class="text-slate-800">Q{{ parseFloat(order.final_price ?? order.base_fare ?? '0').toFixed(2) }}</span></p>
    <button @click="emit('accept', order.id)" class="mt-2 bg-teal-600 text-white rounded-lg py-2">
      Aceptar pedido
    </button>
  </div>
</template>
