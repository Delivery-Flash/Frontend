<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    @click="emit('select')"
    class="group bg-white rounded-2xl shadow-xl p-8 text-left hover:ring-4 hover:ring-teal-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    <div
      class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-teal-100 group-hover:scale-110 transition-transform duration-300"
    >
      {{ icon }}
    </div>
    <h3 class="text-2xl font-bold mb-2 text-teal-600">
      {{ title }}
    </h3>
    <p class="text-gray-500 mb-6">
      {{ description }}
    </p>
    <span
      class="inline-block w-full text-center py-3 rounded-xl text-white font-semibold shadow-md group-hover:shadow-lg transition-shadow bg-gradient-to-r from-teal-600 to-teal-500"
    >
      Continuar
    </span>
  </button>
</template>