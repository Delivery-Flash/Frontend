<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'

const router = useRouter()
const isDrawerOpen = ref(false)

function openDrawer() {
  isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
}

function goToLogin() {
  closeDrawer()
  router.push('/login')
}

function goToRegister() {
  closeDrawer()
  router.push('/register')
}
const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 relative overflow-hidden">
    <div aria-hidden class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 top-8 w-[480px] h-[480px] bg-teal-200/30 rounded-full filter blur-3xl"></div>
      <div class="absolute -right-24 bottom-12 w-[360px] h-[360px] bg-slate-200/40 rounded-full filter blur-2xl"></div>
    </div>

    <!-- Navbar -->
    <header class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-teal-600 rounded flex items-center justify-center text-white font-bold">DF</div>
        <span class="font-extrabold text-gray-800 text-lg">Delivery <span class="text-teal-600">Flash</span></span>
      </div>
      <button
        @click="openDrawer"
        class="text-sm font-semibold text-white bg-teal-600 px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
      >
        Empezar
      </button>
    </header>

    <section class="max-w-6xl mx-auto px-6 pt-10 pb-24 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <span class="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Entregas rapidas ...
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Realiza tus pedidos<br />
          <span class="text-teal-600">rápido y seguro</span>
        </h1>
        <p class="mt-4 text-gray-500 text-base max-w-md">
          Gestión sencilla para clientes y repartidores. ordena tu pedido en
          recíbelo donde estés.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <button
            @click="openDrawer"
            class="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Empezar ahora
          </button>
        </div>

        <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Entregas rapidas
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Seguimiento
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Soporte 24/7
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
        <div class="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400 text-sm">
          Imagen del producto
        </div>
        <h3 class="font-semibold text-gray-800 text-lg">Combo especial del día</h3>
        <p class="text-sm text-gray-500 mt-1">
          Entrega garantizada que sera rapida.
        </p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-2xl font-extrabold text-teal-600">Q50.00</span>
          <button
            @click="openDrawer"
            class="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Pedir este artículo
          </button>
        </div>
      </div>
    </section>

    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        @click="closeDrawer"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
      ></div>
    </Transition>

    <Transition name="slide">
      <aside
        v-if="isDrawerOpen"
        class="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
      >
        <div class="flex items-center justify-between px-6 py-6 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-teal-600 rounded flex items-center justify-center text-white font-bold text-sm">DF</div>
            <span class="font-semibold text-gray-800">Bienvenido</span>
          </div>
          <button
            @click="closeDrawer"
            aria-label="Cerrar"
            class="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-slate-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 px-6 py-8 flex flex-col">
          <h2 class="text-xl font-bold text-gray-800">Accede a tu cuenta</h2>
          <p class="text-sm text-gray-500 mt-1.5">
            Elige una opción para continuar con tu pedido.
          </p>

          <div class="mt-8 space-y-3">
            <button
              @click="isLoginOpen = true"
              class="w-full flex items-center justify-between bg-teal-600 text-white px-5 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
            >
              <span>Iniciar sesión</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              @click="isRegisterOpen = true"
              class="w-full flex items-center justify-between bg-white text-teal-700 border border-teal-200 px-5 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors cursor-pointer"
            >
              <span>Crear cuenta nueva</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div class="mt-10 pt-6 border-t border-slate-100">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              ¿Eres cliente o repartidor?
            </p>
            <button
              class="w-full flex items-center justify-between bg-slate-50 text-gray-700 px-5 py-3.5 rounded-lg font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Únete como socio</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="px-6 py-5 border-t border-slate-100 text-center">
          <p class="text-xs text-gray-400">
            ¿Problemas para iniciar sesión?
            <a class="text-teal-600 hover:underline font-medium">Contactar soporte</a>
          </p>
        </div>
      </aside>
    </Transition>
  </div>
    <LoginModal v-model="isLoginOpen" />
    <RegisterModal v-model="isRegisterOpen" />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>