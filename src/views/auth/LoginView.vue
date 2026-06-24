<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()

function close() {
  emit('update:modelValue', false)
}

function goToRegister() {
  close()
  router.push('/register')
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="props.modelValue"
      @click.self="close"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Transition name="pop" appear>
        <div
          class="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          <button
            @click="close"
            aria-label="Cerrar"
            class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-400 hover:bg-slate-100 hover:text-gray-600 transition-colors cursor-pointer shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="hidden md:flex md:w-1/2 bg-teal-600 p-8 items-center">
            <div class="text-white max-w-xs">
              <h1 class="text-3xl font-extrabold">Delivery <span class="text-teal-200">Flash</span></h1>
              <p class="mt-3 text-sm text-teal-100">Recibe tus pedidos rápido y seguro.</p>
              <ul class="mt-6 space-y-2 text-sm text-teal-100">
                <li>• Entregas</li>
                <li>• Pedidos</li>
              </ul>
            </div>
          </div>

          <div class="w-full md:w-1/2 p-8">
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-teal-600 rounded flex items-center justify-center text-white font-bold">DF</div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-800">Inicia sesión</h2>
                    <p class="text-sm text-gray-500">Bienvenido a Delivery Flash</p>
                  </div>
                </div>
                <a @click="goToRegister" class="text-sm text-teal-600 hover:underline cursor-pointer">Registrarse</a>
              </div>
            </div>

            <LoginForm />

            <div class="mt-4 text-center text-sm text-gray-500">
              <a class="text-teal-600 hover:underline">Contactar soporte</a>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.pop-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.pop-enter-from {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.pop-leave-to {
  transform: scale(0.97);
  opacity: 0;
}
</style>