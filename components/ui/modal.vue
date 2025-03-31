<script setup lang="ts">
defineProps<{
  modalTitle: string
  modalMessage: string
  modalActionText: string
  modalActionColor: string
  confirmAction: () => void
}>()
const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #body>
      <div class="p-4">
        <h3 class="text-lg font-medium mb-2 text-slate-900 dark:text-white">{{ modalTitle }}</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-4">{{ modalMessage }}</p>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="showModal = false">
            {{ $t('cancel') }}
          </UButton>
          <UButton :color="modalActionColor" @click="confirmAction">
            {{ modalActionText }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>