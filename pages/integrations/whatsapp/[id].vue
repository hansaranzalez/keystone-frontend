<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div class="max-w-2xl mx-auto">
      <NuxtLink to="/integrations/whatsapp" class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light mb-4">
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
        {{ $t('integrations.whatsapp.backToAccounts') }}
      </NuxtLink>
      
      <!-- Loading state -->
      <div v-if="whatsAppStore.loading" class="py-8 flex justify-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
      </div>
      
      <!-- Error state -->
      <div v-else-if="whatsAppStore.error" class="py-6 flex justify-center">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="error"
          :title="$t('error')"
          :description="whatsAppStore.error && whatsAppStore.error.includes('.') ? $t(whatsAppStore.error) : whatsAppStore.error"
          class="w-full"
        >
          <template #footer>
            <UButton
              color="error"
              variant="ghost"
              @click="loadAccount"
              icon="i-heroicons-arrow-path"
              size="sm"
            >
              {{ $t('retry') }}
            </UButton>
          </template>
        </UAlert>
      </div>
      
      <!-- Account not found -->
      <div v-else-if="!account" class="py-6 flex flex-col items-center justify-center">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="warning"
          :title="$t('integrations.whatsapp.accountNotFound')"
          class="w-full mb-4"
        />
        <UButton
          to="/integrations/whatsapp"
          color="primary"
          variant="soft"
          icon="i-heroicons-arrow-left"
        >
          {{ $t('integrations.whatsapp.backToAccounts') }}
        </UButton>
      </div>
      
      <!-- Account details -->
      <div v-else>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{{ account.name }}</h1>
          <UBadge :color="statusColor" class="text-sm self-start sm:self-auto">
            {{ statusText }}
          </UBadge>
        </div>
        
        <!-- Status card for accounts that need verification -->
        <UCard
          v-if="needsVerification"
          class="mb-6"
          color="warning"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
              <h3 class="font-medium">{{ $t('integrations.whatsapp.verificationRequired') }}</h3>
            </div>
          </template>
          
          <p>{{ $t('integrations.whatsapp.needsVerificationMessage') }}</p>
          
          <template #footer>
            <UButton
              @click="verifyConnection"
              color="warning"
              variant="soft"
              icon="i-heroicons-check-circle"
              size="sm"
            >
              {{ $t('integrations.whatsapp.verify') }}
            </UButton>
          </template>
        </UCard>
        
        <!-- Connection error card -->
        <UCard
          v-else-if="hasConnectionError"
          class="mb-6"
          color="error"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
              <h3 class="font-medium">{{ $t('integrations.whatsapp.connectionError') }}</h3>
            </div>
          </template>
          
          <p>{{ account.errorMessage || $t('integrations.whatsapp.unknownError') }}</p>
          
          <template #footer>
            <UButton
              @click="verifyConnection"
              color="error"
              variant="soft"
              icon="i-heroicons-arrow-path"
              size="sm"
            >
              {{ $t('integrations.whatsapp.retry') }}
            </UButton>
          </template>
        </UCard>
        
        <!-- Active connection card -->
        <UCard
          v-else-if="isConnected"
          class="mb-6"
          color="success"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
              <h3 class="font-medium">{{ $t('integrations.whatsapp.connectionActive') }}</h3>
            </div>
          </template>
          
          <p>{{ $t('integrations.whatsapp.connectionActiveDescription') }}</p>
        </UCard>
        
        <!-- Account information -->
        <UCard class="mb-6 rounded-lg">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-slate-900 dark:text-white">{{ $t('integrations.whatsapp.accountDetails') }}</h2>
            </div>
          </template>
          
          <div class="space-y-4">
            <!-- Account ID -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.id') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200 break-all">{{ account.id }}</p>
            </div>
            
            <!-- Account Name -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.name') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200">{{ account.name }}</p>
            </div>
            
            <!-- Phone Number -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.phone') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200">{{ account.phoneNumber || $t('notSpecified') }}</p>
            </div>
            
            <!-- Business Name -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.businessName') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200">{{ account.businessName || $t('notSpecified') }}</p>
            </div>
            
            <!-- Business Account ID -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.businessAccountId') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200 break-all">{{ account.businessAccountId }}</p>
            </div>
            
            <!-- Phone Number ID -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.phoneNumberId') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200 break-all">{{ account.phoneNumberId }}</p>
            </div>
            
            <!-- Created At -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.createdAt') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200">{{ formatDate(account.createdAt) }}</p>
            </div>
            
            <!-- Last Connection -->
            <div>
              <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.lastConnection') }}</h3>
              <p class="mt-1 text-slate-900 dark:text-slate-200">{{ account.lastVerifiedAt ? formatDate(account.lastVerifiedAt) : $t('never') }}</p>
            </div>
          </div>
        </UCard>
        
        <!-- Actions -->
        <!-- <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <UButton 
              v-if="isConnected || needsVerification" 
              @click="confirmDeactivate" 
              icon="i-heroicons-power-off" 
              color="warning" 
              variant="soft"
              size="sm"
              class="grow sm:grow-0"
            >
              {{ $t('integrations.whatsapp.deactivate') }}
            </UButton>
            <UButton 
              v-else-if="!account.isActive" 
              @click="confirmActivate" 
              icon="i-heroicons-arrow-up-circle" 
              color="primary" 
              variant="soft"
              size="sm"
              class="grow sm:grow-0"
            >
              {{ $t('integrations.whatsapp.activate') }}
            </UButton>
          </div>
          
          <UButton 
            @click="confirmDelete" 
            icon="i-heroicons-trash" 
            color="error" 
            variant="ghost"
            size="sm"
            class="w-full sm:w-auto"
          >
            {{ $t('delete') }}
          </UButton>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import { WhatsAppConnectionStatus } from '~/services/whatsapp.service';
import type { WhatsAppAccount, WhatsAppAccountFormData } from '~/services/whatsapp.service';
import wpAccountModal from '~/components/ui/modal.vue';

// Initialize router and route
const route = useRoute();
const router = useRouter();

// Initialize i18n
const { t } = useI18n();

// Initialize WhatsApp store
const whatsAppStore = useWhatsAppStore();

// Account ID from route
const accountId = computed(() => route.params.id as string);

// Get the current account
const account = computed(() => whatsAppStore.selectedAccount);

// Edit mode state
const isEditing = ref(false);

// Modal state
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalActionText = ref('');
const modalActionColor = ref<'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'secondary'>('primary');
const pendingAction = ref<() => Promise<void>>(() => Promise.resolve());

  const overlay = useOverlay();

  const modal = overlay.create(wpAccountModal, {
  props: {
    modalTitle,
    modalMessage,
    modalActionText,
    modalActionColor,
    confirmAction,
  }
});

// Status computations
const isConnected = computed(() => 
  account.value?.status === WhatsAppConnectionStatus.CONNECTED
);
const needsVerification = computed(() => 
  account.value?.status === WhatsAppConnectionStatus.PENDING || 
  account.value?.status === WhatsAppConnectionStatus.DISCONNECTED
);
const hasConnectionError = computed(() => 
  account.value?.status === WhatsAppConnectionStatus.ERROR
);

// Status display text
const statusText = computed(() => {
  if (!account.value) return '';
  
  if (!account.value.isActive) {
    return t('integrations.whatsapp.inactive');
  }
  
  switch (account.value.status) {
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

// Status color
const statusColor = computed(() => {
  if (!account.value) return 'neutral';
  
  if (!account.value.isActive) {
    return 'neutral';
  }
  
  switch (account.value.status) {
    case WhatsAppConnectionStatus.CONNECTED:
      return 'success';
    case WhatsAppConnectionStatus.PENDING:
      return 'warning';
    case WhatsAppConnectionStatus.ERROR:
      return 'error';
    case WhatsAppConnectionStatus.DISCONNECTED:
      return 'neutral';
    default:
      return 'neutral';
  }
});

// Format date
function formatDate(dateString: string) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Load account data on page mount
onMounted(loadAccount);

// Load account data
async function loadAccount() {
  await whatsAppStore.loadAccount(accountId.value);
}

// Toggle edit mode
function openEditMode() {
  isEditing.value = true;
}

// Update account
async function updateAccount(formData: WhatsAppAccountFormData) {
  await whatsAppStore.updateAccount(accountId.value, formData);
  isEditing.value = false;
  await loadAccount();
}

// Verify connection
async function verifyConnection() {
  await whatsAppStore.verifyConnection(accountId.value);
  await loadAccount();
}

// Confirmation handlers
async function confirmActivate() {
  modalTitle.value = t('integrations.whatsapp.activateAccount');
  modalMessage.value = t('integrations.whatsapp.activateAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.activate');
  modalActionColor.value = 'primary';
  pendingAction.value = activateAccount;
  await modal.open();
}

async function confirmDeactivate() {
  modalTitle.value = t('integrations.whatsapp.deactivateAccount');
  modalMessage.value = t('integrations.whatsapp.deactivateAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.deactivate');
  modalActionColor.value = 'warning';
  pendingAction.value = deactivateAccount;
  await modal.open();
}

async function confirmDelete() {
  modalTitle.value = t('integrations.whatsapp.deleteAccount');
  modalMessage.value = t('integrations.whatsapp.deleteAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.delete');
  modalActionColor.value = 'error';
  pendingAction.value = deleteAccount;
  await modal.open();
}

// Action handlers
async function activateAccount() {
  await whatsAppStore.activateAccount(accountId.value);
  showModal.value = false;
  await loadAccount();
}

async function deactivateAccount() {
  await whatsAppStore.deactivateAccount(accountId.value);
  showModal.value = false;
  await loadAccount();
}

async function deleteAccount() {
  await whatsAppStore.deleteAccount(accountId.value);
  showModal.value = false;
  router.push('/integrations/whatsapp');
}

// Execute the pending action
async function confirmAction() {
  await pendingAction.value();
}
</script>

<style scoped>
.loading-spinner {
  width: 2rem;
  height: 2rem;
  border-width: 4px;
  border-color: #e5e7eb;
  border-top-color: var(--color-primary);
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  display: inline-flex;
  align-items: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark, var(--color-primary));
}
</style>
