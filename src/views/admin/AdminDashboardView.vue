<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import * as adminService from '@/services/admin.service'
import * as earningsService from '@/services/earnings.service'
import type { AdminUser, PendingRider, OrdersReport, EarningsReport } from '@/services/admin.service'
import type { AdminEarningsSummary } from '@/services/earnings.service'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'overview' | 'users' | 'riders'>('overview')

const users = ref<AdminUser[]>([])
const pendingRiders = ref<PendingRider[]>([])
const ordersReport = ref<OrdersReport | null>(null)
const earningsReport = ref<EarningsReport | null>(null)
const globalSummary = ref<AdminEarningsSummary | null>(null)

const loading = ref(false)
const errorMessage = ref('')
const verifyingId = ref<number | null>(null)
const verifySuccess = ref<number | null>(null)

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}

function formatAmount(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(String(value)).toFixed(2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function loadOverview() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [orders, earnings, summary] = await Promise.all([
      adminService.getOrdersReport(),
      adminService.getEarningsReport(),
      earningsService.getGlobalEarningsSummary(),
    ])
    console.log('Fetched reports:', { orders, earnings, summary })
    ordersReport.value = orders
    earningsReport.value = earnings
    globalSummary.value = summary

    console.log('Orders report:', ordersReport.value)
    console.log('Earnings report:', earningsReport.value)
    console.log('Global summary:', globalSummary.value)
  } catch {
    errorMessage.value = 'No se pudieron cargar los reportes.'
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  loading.value = true
  errorMessage.value = ''
  try {
    users.value = await adminService.getAllUsers()
  } catch {
    errorMessage.value = 'No se pudo cargar la lista de usuarios.'
  } finally {
    loading.value = false
  }
}

async function loadPendingRiders() {
  loading.value = true
  errorMessage.value = ''
  try {
    pendingRiders.value = await adminService.getPendingRiders()
  } catch {
    errorMessage.value = 'No se pudieron cargar los repartidores pendientes.'
  } finally {
    loading.value = false
  }
}

async function verifyRider(riderId: number) {
  verifyingId.value = riderId
  try {
    await adminService.verifyRider(riderId)
    pendingRiders.value = pendingRiders.value.filter((r) => r.id !== riderId)
    verifySuccess.value = riderId
    setTimeout(() => { verifySuccess.value = null }, 2500)
  } catch {
    errorMessage.value = 'No se pudo verificar el repartidor.'
  } finally {
    verifyingId.value = null
  }
}

async function switchTab(tab: typeof activeTab.value) {
  activeTab.value = tab
  if (tab === 'overview') await loadOverview()
  else if (tab === 'users') await loadUsers()
  else if (tab === 'riders') await loadPendingRiders()
}

onMounted(() => loadOverview())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden p-6">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[480px] h-[480px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[360px] h-[360px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-teal-600 rounded flex items-center justify-center text-white font-bold">DF</div>
          <div>
            <h1 class="text-2xl font-extrabold text-gray-800">Panel de administración</h1>
            <p class="text-sm text-slate-400">Delivery Flash</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="router.push({ name: 'profile' })" class="bg-white text-teal-700 border border-teal-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-teal-50 transition-colors">
            Mi perfil
          </button>
          <button @click="handleLogout" class="bg-white text-slate-700 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <nav class="flex gap-1 bg-white rounded-xl shadow border border-slate-100 p-1 mb-6">
        <button
          v-for="tab in [
            { key: 'overview', label: 'Resumen' },
            { key: 'users', label: 'Usuarios' },
            { key: 'riders', label: 'Riders pendientes' },
          ]"
          :key="tab.key"
          @click="switchTab(tab.key as any)"
          class="flex-1 text-sm font-semibold py-2 rounded-lg transition-colors"
          :class="activeTab === tab.key
            ? 'bg-teal-600 text-white shadow'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'riders' && pendingRiders.length > 0"
            class="ml-1 bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
          >{{ pendingRiders.length }}</span>
        </button>
      </nav>

      <!-- Error -->
      <p v-if="errorMessage" class="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {{ errorMessage }}
      </p>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>

      <!-- ─── OVERVIEW TAB ─── -->
      <div v-else-if="activeTab === 'overview'">
        <!-- Orders report -->
        <div v-if="ordersReport" class="mb-6">
          <h2 class="text-base font-semibold text-gray-700 mb-3">Resumen de pedidos</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow border border-slate-100 p-4 text-center">
              <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Total</p>
              <p class="text-3xl font-extrabold text-gray-800">{{ ordersReport.totalOrders }}</p>
            </div>
            <!-- <div class="bg-white rounded-xl shadow border border-slate-100 p-4 text-center">
              <p class="text-xs text-amber-500 uppercase tracking-wide font-semibold mb-1">Disponibles</p>
              <p class="text-3xl font-extrabold text-amber-600">{{ ordersReport.available }}</p>
            </div> -->
            <div class="bg-white rounded-xl shadow border border-slate-100 p-4 text-center">
              <p class="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1">Aceptados</p>
              <p class="text-3xl font-extrabold text-blue-600">{{ ordersReport.byStatus.ACCEPTED}}</p>
            </div>
            <div class="bg-white rounded-xl shadow border border-slate-100 p-4 text-center">
              <p class="text-xs text-emerald-500 uppercase tracking-wide font-semibold mb-1">Entregados</p>
              <p class="text-3xl font-extrabold text-emerald-600">{{ ordersReport.byStatus.DELIVERED }}</p>
            </div>
          </div>
        </div>

        <!-- Earnings report -->
        <div v-if="earningsReport" class="mb-6">
          <h2 class="text-base font-semibold text-gray-700 mb-3">Reporte de ganancias</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div class="bg-white rounded-xl shadow border border-slate-100 p-5">
              <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                Ingresos brutos
              </p>

              <p class="text-3xl font-extrabold text-teal-600">
                Q{{ formatAmount(earningsReport?.totalGross) }}
              </p>

              <p class="text-xs text-slate-400 mt-1">
                {{ earningsReport?.totalRecords }} pedidos
              </p>
            </div>

            <div class="bg-white rounded-xl shadow border border-slate-100 p-5">
              <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                Comisiones / costos
              </p>

              <p class="text-3xl font-extrabold text-blue-600">
                Q{{ formatAmount(earningsReport?.totalFee) }}
              </p>

              <p class="text-xs text-slate-400 mt-1">
                Total descontado
              </p>
            </div>

            <div class="bg-white rounded-xl shadow border border-slate-100 p-5">
              <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                Ingresos netos
              </p>

              <p class="text-3xl font-extrabold text-gray-800">
                Q{{ formatAmount(earningsReport?.totalNet) }}
              </p>

              <p class="text-xs text-slate-400 mt-1">
                Después de comisiones
              </p>
            </div>

          </div>
        </div>

        <div v-if="!earningsReport && !loading"
            class="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center text-slate-500">
          No hay datos disponibles.
        </div>
      </div>

      <!-- ─── USERS TAB ─── -->
      <div v-else-if="activeTab === 'users'">
        <div v-if="users.length === 0" class="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center text-slate-500">
          No hay usuarios registrados.
        </div>
        <div v-else class="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50">
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">ID</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Nombre</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Correo</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rol</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Registro</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3 text-slate-400">#{{ user.id }}</td>
                  <td class="px-4 py-3 font-medium text-gray-800">{{ user.first_name }} {{ user.last_name }}</td>
                  <td class="px-4 py-3 text-slate-500">{{ user.email }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-teal-100 text-teal-700': user.role === 'CLIENT',
                        'bg-blue-100 text-blue-700': user.role === 'RIDER',
                        'bg-purple-100 text-purple-700': user.role === 'ADMIN',
                      }"
                    >{{ user.role === 'CLIENT' ? 'Cliente' : user.role === 'RIDER' ? 'Repartidor' : 'Admin' }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-400">{{ formatDate(user.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ─── PENDING RIDERS TAB ─── -->
      <div v-else-if="activeTab === 'riders'">
        <p v-if="verifySuccess !== null" class="text-emerald-600 text-sm mb-4 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
          ✓ Repartidor verificado correctamente.
        </p>

        <div v-if="pendingRiders.length === 0" class="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center">
          <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-500 font-medium">Sin repartidores pendientes</p>
          <p class="text-slate-400 text-sm mt-1">Todos los repartidores están verificados.</p>
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="rider in pendingRiders"
            :key="rider.id"
            class="bg-white rounded-xl shadow border border-slate-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <p class="font-semibold text-gray-800">{{ rider.first_name }} {{ rider.last_name }}</p>
                <span class="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Pendiente</span>
              </div>
              <p class="text-sm text-slate-500">{{ rider.email }}</p>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span v-if="rider.vehicle_type">Vehículo: <span class="text-slate-600">{{ rider.vehicle_type }}</span></span>
                <span v-if="rider.vehicle_model">Modelo: <span class="text-slate-600">{{ rider.vehicle_model }}</span></span>
                <span v-if="rider.license_plate">Placa: <span class="text-slate-600">{{ rider.license_plate }}</span></span>
                <span v-if="rider.zone">Zona: <span class="text-slate-600">{{ rider.zone }}</span></span>
                <span>Registro: <span class="text-slate-600">{{ formatDate(rider.createdAt) }}</span></span>
              </div>
            </div>
            <button
              @click="verifyRider(rider.id)"
              :disabled="verifyingId === rider.id"
              class="shrink-0 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {{ verifyingId === rider.id ? 'Verificando...' : 'Verificar repartidor' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
