// components/SplashScreen.vue
<template>
  <div
    :class="[
      'fixed inset-0 flex items-center justify-center bg-gray-900 z-50 transition-opacity duration-500',
      { 'opacity-0 pointer-events-none': !isVisible },
    ]"
  >
    <div class="text-center">
      <!-- Logo container -->
      <div class="mb-8">
        <UIcon name="icon-park-twotone-coordinate-system" class="text-6xl" />
      </div>

      <!-- Loading spinner -->
      <div class="flex justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-dotted border-l-4 border-b-4 border-gray-300"
        ></div>
      </div>

      <!-- Loading text -->
      <p class="mt-4 text-base text-gray-400">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
  loadingText?: string;
}

// Define props with defaults
withDefaults(defineProps<Props>(), {
  isVisible: true,
  loadingText: "Cargando... En breve estará aquí",
});
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
