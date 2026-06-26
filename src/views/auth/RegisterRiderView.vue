<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterRiderForm from '@/components/auth/RegisterRiderForm.vue'

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-500 to-teal-100 p-4 py-10 relative overflow-hidden">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[480px] h-[480px] bg-slate-300/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[360px] h-[360px] bg-white/20 rounded-full filter blur-2xl"></div>
    </div>

    <div class="w-full max-w-md">
      <button
        @click="goBack"
        class="text-white/90 mb-6 flex items-center gap-2 hover:gap-3 transition-all duration-200 font-medium cursor-pointer text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>

      <div class="text-center mb-6">
        <div class="w-14 h-14 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
          🛵
        </div>
        <h1 class="text-3xl font-extrabold text-white drop-shadow-sm">
          Registro de Repartidor
        </h1>
        <p class="text-teal-50 mt-2 text-sm">
          Genera ingresos haciendo entregas cuando quieras
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <RegisterRiderForm />
      </div>

      <p class="text-center text-xs text-teal-50/80 mt-5">
        Al registrarte aceptas nuestros
        <a class="text-white hover:underline font-medium">Términos</a>
        y
        <a class="text-white hover:underline font-medium">Política de privacidad</a>
      </p>
    </div>
  </div>
</template>
