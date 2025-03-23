<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div class="max-w-2xl mx-auto">
      <NuxtLink to="/integrations/whatsapp" class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light mb-2">
        <IconArrowLeft class="w-4 h-4 mr-1" />
        {{ $t('integrations.whatsapp.backToAccounts') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{{ $t('integrations.whatsapp.addAccount') }}</h1>
      
      <!-- Account Form -->
      <WhatsAppAccountForm 
        :loading="whatsAppStore.loading"
        @submit="createAccount"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import type { WhatsAppAccountFormData } from '~/services/whatsapp.service';
import WhatsAppAccountForm from '~/components/integrations/whatsapp/WhatsAppAccountForm.vue';

// Initialize router
const router = useRouter();

// Initialize i18n
const { t } = useI18n();

// Initialize WhatsApp store
const whatsAppStore = useWhatsAppStore();

// Handle account creation
async function createAccount(formData: WhatsAppAccountFormData) {
  const createdAccount = await whatsAppStore.createAccount(formData);
  
  if (createdAccount) {
    // Navigate to the account detail page if creation was successful
    router.push(`/integrations/whatsapp/${createdAccount.id}`);
  }
}

// Navigate back to accounts list
function goBack() {
  router.push('/integrations/whatsapp');
}
</script>
