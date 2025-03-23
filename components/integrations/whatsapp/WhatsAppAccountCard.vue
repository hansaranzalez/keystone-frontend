<template>
  <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow bg-white dark:bg-slate-800">
    <div class="p-3 sm:p-4">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :class="statusClass">
            <IconWhatsapp class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100">{{ account.name }}</h3>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <span :class="statusTextClass">{{ statusText }}</span>
              <span v-if="account.phoneNumber" class="ml-2">• {{ account.phoneNumber }}</span>
            </div>
          </div>
        </div>
        <div>
          <UBadge v-if="!account.isActive" size="sm" color="neutral">
            {{ $t('integrations.whatsapp.inactive') }}
          </UBadge>
        </div>
      </div>
      
      <div class="mt-4 flex flex-wrap gap-2 justify-end">
        <!-- Connected account actions -->
        <template v-if="account.status === 'CONNECTED' && account.isActive">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Pending account actions -->
        <template v-else-if="account.status === 'PENDING' && account.isActive">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton size="sm" color="primary" variant="solid" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Error account actions -->
        <template v-else-if="account.status === 'ERROR' && account.isActive">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton size="sm" color="primary" variant="solid" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Disconnected account actions -->
        <template v-else-if="account.status === 'DISCONNECTED' && account.isActive">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton size="sm" color="primary" variant="solid" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Inactive account actions -->
        <template v-else-if="!account.isActive">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton size="sm" color="primary" variant="solid" icon="i-heroicons-arrow-up-circle" @click="$emit('activate', account)">
            {{ $t('integrations.whatsapp.activate') }}
          </UButton>
          <UButton size="sm" color="error" variant="ghost" icon="i-heroicons-trash" @click="$emit('delete', account)">
            {{ $t('delete') }}
          </UButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WhatsAppAccount } from '~/services/whatsapp.service';
import { WhatsAppConnectionStatus } from '~/services/whatsapp.service';

// Initialize i18n
const { t } = useI18n();

// Define component props
const props = defineProps<{
  account: WhatsAppAccount;
}>();

// Define component events
defineEmits<{
  (e: 'view', account: WhatsAppAccount): void;
  (e: 'verify', account: WhatsAppAccount): void;
  (e: 'activate', account: WhatsAppAccount): void;
  (e: 'deactivate', account: WhatsAppAccount): void;
  (e: 'delete', account: WhatsAppAccount): void;
}>();

// Compute status display text
const statusText = computed(() => {
  switch (props.account.status) {
    case WhatsAppConnectionStatus.CONNECTED:
      return t('integrations.whatsapp.status.connected');
    case WhatsAppConnectionStatus.PENDING:
      return t('integrations.whatsapp.status.pending');
    case WhatsAppConnectionStatus.ERROR:
      return t('integrations.whatsapp.status.error');
    case WhatsAppConnectionStatus.DISCONNECTED:
      return t('integrations.whatsapp.status.disconnected');
    default:
      return t('integrations.whatsapp.status.unknown');
  }
});

// Compute status background color class
const statusClass = computed(() => {
  if (!props.account.isActive) return 'bg-slate-400 dark:bg-slate-500';
  
  switch (props.account.status) {
    case WhatsAppConnectionStatus.CONNECTED:
      return 'bg-green-500 dark:bg-green-600';
    case WhatsAppConnectionStatus.PENDING:
      return 'bg-amber-500 dark:bg-amber-600';
    case WhatsAppConnectionStatus.ERROR:
      return 'bg-red-500 dark:bg-red-600';
    case WhatsAppConnectionStatus.DISCONNECTED:
      return 'bg-slate-500 dark:bg-slate-600';
    default:
      return 'bg-slate-500 dark:bg-slate-600';
  }
});

// Compute status text color class
const statusTextClass = computed(() => {
  if (!props.account.isActive) return 'text-slate-500 dark:text-slate-400';
  
  switch (props.account.status) {
    case WhatsAppConnectionStatus.CONNECTED:
      return 'text-green-600 dark:text-green-500';
    case WhatsAppConnectionStatus.PENDING:
      return 'text-amber-600 dark:text-amber-500';
    case WhatsAppConnectionStatus.ERROR:
      return 'text-red-600 dark:text-red-500';
    case WhatsAppConnectionStatus.DISCONNECTED:
      return 'text-slate-600 dark:text-slate-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
});
</script>
