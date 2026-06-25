<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as earningsService from '@/services/earnings.service'
import type { Earning, EarningsSummary } from '@/services/earnings.service'

const router = useRouter()
const earnings = ref<Earning[]>([])
const summary = ref<EarningsSummary | null>(null)
const loading = ref(false)
const errorMessage = ref('')

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAmount(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(String(value)).toFixed(2)
}

async function loadEarnings() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [earningsData, summaryData] = await Promise.all([
      earningsService.getMyEarnings(),
      earningsService.getMyEarningsSummary(),
    ])
    earnings.value = earningsData
    summary.value = summaryData
  } catch {
    errorMessage.value = 'No se pudieron cargar tus ganancias.'
  } finally {
    loading.value = false
  }
}

onMounted(loadEarnings)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[420px] h-[420px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[320px] h-[320px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <header class="flex items-center gap-3 mb-6">
        <button @click="router.push({ name: 'rider-board' })" class="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-extrabold text-gray-800">Mis ganancias</h1>
          <p class="text-sm text-slate-400">Resumen de tus ingresos como repartidor</p>
        </div>
      </header>

      <!-- Error -->
      <p v-if="errorMessage" class="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {{ errorMessage }}
      </p>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <!-- Summary cards -->
        <div v-if="summary" class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-2xl shadow border border-slate-100 p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Total ganado</p>
            <p class="text-3xl font-extrabold text-teal-600">Q{{ formatAmount(summary.total) }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow border border-slate-100 p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Entregas completadas</p>
            <p class="text-3xl font-extrabold text-gray-800">{{ summary.count }}</p>
          </div>
          <div v-if="summary.average !== undefined" class="col-span-2 bg-white rounded-2xl shadow border border-slate-100 p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Ganancia promedio por entrega</p>
            <p class="text-2xl font-extrabold text-gray-800">Q{{ formatAmount(summary.average) }}</p>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="earnings.length === 0" class="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-500 font-medium">Sin ganancias registradas</p>
          <p class="text-slate-400 text-sm mt-1">Completa entregas para ver tus ingresos aquí.</p>
          <button @click="router.push({ name: 'rider-board' })" class="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors">
            Ver pedidos disponibles
          </button>
        </div>

        <!-- Earnings list -->
        <div v-else>
          <h2 class="text-base font-semibold text-gray-700 mb-3">Historial de ganancias</h2>
          <div class="flex flex-col gap-3">
            <div
              v-for="earning in earnings"
              :key="earning.id"
              class="bg-white rounded-xl shadow border border-slate-100 p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {{ earning.order ? `${earning.order.origin} → ${earning.order.destination}` : `Pedido #${earning.orderId}` }}
                  </p>
                  <p class="text-xs text-slate-400">{{ formatDate(earning.createdAt) }}</p>
                </div>
              </div>
              <span class="text-base font-extrabold text-teal-600">Q{{ formatAmount(earning.amount) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
