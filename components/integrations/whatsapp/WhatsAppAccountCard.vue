<template>
  <UCard class="hover:shadow transition-shadow overflow-hidden">
    <div class="p-2 sm:p-4">
      <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :class="statusClass">
            <IconWhatsapp class="w-5 h-5 text-white" />
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="text-base sm:text-lg font-medium truncate">{{ account.name }}</h3>
            <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400">
              <span :class="statusTextClass">{{ statusText }}</span>
              <span v-if="account.phoneNumber" class="ml-2 truncate">• {{ account.phoneNumber }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <UBadge v-if="!account.isActive" size="sm" color="neutral">
            {{ $t('integrations.whatsapp.inactive') }}
          </UBadge>
        </div>
      </div>
      
      <div class="mt-4 sm:mt-6 flex flex-wrap gap-2 justify-center sm:justify-end">
        <!-- Actions for mobile devices: convert to dropdown on small screens -->
        <UDropdown v-if="isMobileView" :items="mobileActionItems" position="bottom right" class="sm:hidden w-full">
          <UButton class="w-full" size="sm" color="primary" variant="soft" icon="i-heroicons-ellipsis-horizontal">
            {{ $t('actions') }}
          </UButton>
        </UDropdown>

        <!-- Connected account actions for tablets/desktop -->
        <template v-if="account.status === 'CONNECTED' && account.isActive && !isMobileView">
          <UButton class="hidden sm:flex" size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Pending account actions for tablets/desktop -->
        <template v-else-if="account.status === 'PENDING' && account.isActive && !isMobileView">
          <UButton class="hidden sm:flex" size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="primary" variant="soft" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Error account actions for tablets/desktop -->
        <template v-else-if="account.status === 'ERROR' && account.isActive && !isMobileView">
          <UButton class="hidden sm:flex" size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="primary" variant="soft" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="warning" variant="ghost" icon="i-heroicons-power-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Disconnected account actions for tablets/desktop -->
        <template v-else-if="account.status === 'DISCONNECTED' && account.isActive && !isMobileView">
          <UButton class="hidden sm:flex" size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="primary" variant="soft" icon="i-heroicons-check-circle" @click="$emit('verify', account)">
            {{ $t('integrations.whatsapp.verify') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="warning" variant="ghost" icon="quill-off" @click="$emit('deactivate', account)">
            {{ $t('integrations.whatsapp.deactivate') }}
          </UButton>
        </template>
        
        <!-- Inactive account actions for tablets/desktop -->
        <template v-else-if="!account.isActive && !isMobileView">
          <UButton class="hidden sm:flex" size="sm" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="$emit('view', account)">
            {{ $t('view') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="primary" variant="soft" icon="i-heroicons-arrow-up-circle" @click="$emit('activate', account)">
            {{ $t('integrations.whatsapp.activate') }}
          </UButton>
          <UButton class="hidden sm:flex" size="sm" color="error" variant="ghost" icon="i-heroicons-trash" @click="$emit('delete', account)">
            {{ $t('delete') }}
          </UButton>
        </template>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
const emit = defineEmits<{
  (e: 'view', account: WhatsAppAccount): void;
  (e: 'verify', account: WhatsAppAccount): void;
  (e: 'activate', account: WhatsAppAccount): void;
  (e: 'deactivate', account: WhatsAppAccount): void;
  (e: 'delete', account: WhatsAppAccount): void;
}>();

// Responsive design support using Nuxt's composables for SSR compatibility
const isMobileView = ref(false); // Default to false for SSR

// Use the Nuxt's useWindowSize composable for responsive handling
const { width } = useWindowSize();

// Watch for window size changes
watch(() => width.value, (newWidth) => {
  if (newWidth) {
    isMobileView.value = newWidth < 640; // sm breakpoint in Tailwind is 640px
  }
}, { immediate: true });

// Generate action items for mobile dropdown
const mobileActionItems = computed(() => {
  const items = [
    {
      label: t('view'),
      icon: 'i-heroicons-eye',
      click: () => emit('view', props.account)
    }
  ];

  if (props.account.isActive) {
    // Actions for active accounts
    if (props.account.status === WhatsAppConnectionStatus.PENDING || 
        props.account.status === WhatsAppConnectionStatus.ERROR || 
        props.account.status === WhatsAppConnectionStatus.DISCONNECTED) {
      items.push({
        label: t('integrations.whatsapp.verify'),
        icon: 'i-heroicons-check-circle',
        click: () => emit('verify', props.account)
      });
    }
    
    items.push({
      label: t('integrations.whatsapp.deactivate'),
      icon: 'i-heroicons-power-off',
      click: () => emit('deactivate', props.account)
    });
  } else {
    // Actions for inactive accounts
    items.push(
      {
        label: t('integrations.whatsapp.activate'),
        icon: 'i-heroicons-arrow-up-circle',
        click: () => emit('activate', props.account)
      },
      {
        label: t('delete'),
        icon: 'i-heroicons-trash',
        click: () => emit('delete', props.account)
      }
    );
  }

  return items;
});

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
