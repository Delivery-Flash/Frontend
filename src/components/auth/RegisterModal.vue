<script setup lang="ts">
import { useRouter } from 'vue-router'
import RoleSelectionCard from '@/components/auth/RoleSelectionCard.vue'

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

function selectClient() {
  close()
  router.push('/register/client')
}

function selectDriver() {
  close()
  router.push('/register/driver')
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
        <div class="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 md:p-10">
          <button
            @click="close"
            aria-label="Cerrar"
            class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-slate-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="text-center mb-10">
            <div class="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">DF</div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800">
              ¿Cómo quieres registrarte?
            </h1>
            <p class="text-gray-500 mt-2">Elige la opción que se ajuste a ti</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <RoleSelectionCard
              title="Cliente"
              description="Haz tus pedidos y recíbe en minutos"
              icon="🛒"
              color="teal"
              @select="selectClient"
            />
            <RoleSelectionCard
              title="Repartidor"
              description="Genera ingresos haciendo entregas cuando quieras"
              icon="🛵"
              color="slate"
              @select="selectDriver"
            />
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