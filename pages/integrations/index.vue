<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <h1 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{{ $t('integrations.title') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- WhatsApp Integration Card -->
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
        <div class="bg-green-50 dark:bg-green-900/20 p-4 flex items-center space-x-3">
          <div class="bg-green-500 dark:bg-green-600 text-white p-0 flex items-center justify-center rounded-full">
            <UIcon name="i-mdi-whatsapp" class="w-6 h-6" />
          </div>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">WhatsApp</h2>
        </div>
        
        <div class="p-4">
          <p class="text-slate-700 dark:text-slate-300 mb-4">{{ $t('integrations.whatsapp.description') }}</p>
          
          <div class="flex gap-2 mt-4 items-center justify-end">
            <UButton to="/integrations/whatsapp" color="primary">
              {{ $t('integrations.manage') }}
            </UButton>
          </div>
        </div>
      </div>
      
      <!-- Placeholder for future integrations -->
      <div class="border border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800">
        <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-full mb-3">
          <IconPlus class="w-6 h-6" />
        </div>
        <p class="text-center">{{ $t('integrations.comingSoon') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWhatsAppStore } from '~/store/whatsapp.store';

// Initialize i18n
const { t } = useI18n();

// Initialize WhatsApp store
const whatsAppStore = useWhatsAppStore();

// Load WhatsApp accounts on page mount
onMounted(async () => {
  await whatsAppStore.loadAccounts();
});
</script>


