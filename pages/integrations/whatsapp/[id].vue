<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <NuxtLink to="/integrations/whatsapp" class="inline-flex items-center text-gray-600 hover:text-primary mb-2">
        <IconArrowLeft class="w-4 h-4 mr-1" />
        {{ $t('integrations.whatsapp.backToAccounts') }}
      </NuxtLink>
      
      <!-- Loading state -->
      <div v-if="whatsAppStore.loading" class="py-8 flex justify-center">
        <div class="loading-spinner"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="whatsAppStore.error" class="py-8 flex justify-center">
        <div class="bg-red-50 text-red-600 p-4 rounded-lg">
          {{ whatsAppStore.error }}
          <button @click="loadAccount" class="text-primary hover:underline ml-2">
            {{ $t('retry') }}
          </button>
        </div>
      </div>
      
      <!-- Account not found -->
      <div v-else-if="!account" class="py-8 flex flex-col items-center justify-center">
        <div class="bg-yellow-50 text-yellow-600 p-4 rounded-lg mb-4 w-full">
          {{ $t('integrations.whatsapp.accountNotFound') }}
        </div>
        <NuxtLink to="/integrations/whatsapp" class="btn btn-primary">
          {{ $t('integrations.whatsapp.backToAccounts') }}
        </NuxtLink>
      </div>
      
      <!-- Account details -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">{{ account.name }}</h1>
          <UBadge :color="statusColor" class="text-sm">
            {{ statusText }}
          </UBadge>
        </div>
        
        <!-- Status card for accounts that need verification -->
        <div v-if="needsVerification" class="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-50">
          <div class="flex items-start">
            <IconExclamation class="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h3 class="font-medium text-yellow-800">{{ $t('integrations.whatsapp.verificationNeeded') }}</h3>
              <p class="text-yellow-700 mt-1">{{ $t('integrations.whatsapp.verificationInstructions') }}</p>
              <button @click="verifyConnection" class="mt-3 px-4 py-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md text-sm font-medium transition-colors">
                {{ $t('integrations.whatsapp.verify') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Connection error card -->
        <div v-else-if="hasConnectionError" class="mb-6 p-4 rounded-lg border border-red-300 bg-red-50">
          <div class="flex items-start">
            <IconExclamation class="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 class="font-medium text-red-800">{{ $t('integrations.whatsapp.connectionError') }}</h3>
              <p class="text-red-700 mt-1">{{ account.errorMessage || $t('integrations.whatsapp.unknownError') }}</p>
              <button @click="verifyConnection" class="mt-3 px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-sm font-medium transition-colors">
                {{ $t('integrations.whatsapp.retry') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Active connection card -->
        <div v-else-if="isConnected" class="mb-6 p-4 rounded-lg border border-green-300 bg-green-50">
          <div class="flex items-start">
            <IconCheckCircle class="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <h3 class="font-medium text-green-800">{{ $t('integrations.whatsapp.connectionActive') }}</h3>
              <p class="text-green-700 mt-1">{{ $t('integrations.whatsapp.connectionActiveDescription') }}</p>
            </div>
          </div>
        </div>
        
        <!-- Account information -->
        <div class="bg-white rounded-lg border mb-6">
          <div class="p-4 border-b">
            <h2 class="text-lg font-medium">{{ $t('integrations.whatsapp.accountDetails') }}</h2>
          </div>
          
          <div class="p-4 space-y-4">
            <!-- Account ID -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.id') }}</h3>
              <p class="mt-1">{{ account.id }}</p>
            </div>
            
            <!-- Account Name -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.name') }}</h3>
              <p class="mt-1">{{ account.name }}</p>
            </div>
            
            <!-- Phone Number -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.phone') }}</h3>
              <p class="mt-1">{{ account.phone || $t('notSpecified') }}</p>
            </div>
            
            <!-- Business Name -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.businessName') }}</h3>
              <p class="mt-1">{{ account.businessName || $t('notSpecified') }}</p>
            </div>
            
            <!-- Business Account ID -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.businessAccountId') }}</h3>
              <p class="mt-1">{{ account.businessAccountId }}</p>
            </div>
            
            <!-- Phone Number ID -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.phoneNumberId') }}</h3>
              <p class="mt-1">{{ account.phoneNumberId }}</p>
            </div>
            
            <!-- Created At -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.createdAt') }}</h3>
              <p class="mt-1">{{ formatDate(account.createdAt) }}</p>
            </div>
            
            <!-- Last Connection -->
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ $t('integrations.whatsapp.form.lastConnection') }}</h3>
              <p class="mt-1">{{ account.lastConnectionAt ? formatDate(account.lastConnectionAt) : $t('never') }}</p>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between items-center">
          <div class="space-x-2">
            <UButton @click="openEditMode" icon="i-heroicons-pencil" color="primary" variant="soft">
              {{ $t('edit') }}
            </UButton>
            <UButton v-if="isConnected || needsVerification" @click="confirmDeactivate" icon="i-heroicons-power-off" color="warning" variant="soft">
              {{ $t('integrations.whatsapp.deactivate') }}
            </UButton>
            <UButton v-else-if="!account.isActive" @click="confirmActivate" icon="i-heroicons-arrow-up-circle" color="primary" variant="soft">
              {{ $t('integrations.whatsapp.activate') }}
            </UButton>
          </div>
          
          <UButton @click="confirmDelete" icon="i-heroicons-trash" color="error" variant="ghost">
            {{ $t('delete') }}
          </UButton>
        </div>
        
        <!-- Edit mode -->
        <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div class="p-4 border-b flex justify-between items-center">
              <h2 class="text-lg font-medium">{{ $t('integrations.whatsapp.editAccount') }}</h2>
              <button @click="isEditing = false" class="text-gray-500 hover:text-gray-700">
                <IconX class="w-5 h-5" />
              </button>
            </div>
            
            <div class="p-4">
              <WhatsAppAccountForm 
                :account="account"
                :loading="whatsAppStore.loading"
                @submit="updateAccount"
                @cancel="isEditing = false"
              />
            </div>
          </div>
        </div>
        
        <!-- Confirmation Modal -->
        <UModal v-model="showModal">
          <div class="p-4">
            <h3 class="text-lg font-medium mb-2">{{ modalTitle }}</h3>
            <p class="text-gray-600 mb-4">{{ modalMessage }}</p>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="showModal = false">
                {{ $t('cancel') }}
              </UButton>
              <UButton :color="modalActionColor" @click="confirmAction">
                {{ modalActionText }}
              </UButton>
            </div>
          </div>
        </UModal>
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
function confirmActivate() {
  modalTitle.value = t('integrations.whatsapp.activateAccount');
  modalMessage.value = t('integrations.whatsapp.activateAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.activate');
  modalActionColor.value = 'primary';
  pendingAction.value = activateAccount;
  showModal.value = true;
}

function confirmDeactivate() {
  modalTitle.value = t('integrations.whatsapp.deactivateAccount');
  modalMessage.value = t('integrations.whatsapp.deactivateAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.deactivate');
  modalActionColor.value = 'warning';
  pendingAction.value = deactivateAccount;
  showModal.value = true;
}

function confirmDelete() {
  modalTitle.value = t('integrations.whatsapp.deleteAccount');
  modalMessage.value = t('integrations.whatsapp.deleteAccountConfirmation', { name: account.value?.name || '' });
  modalActionText.value = t('integrations.whatsapp.delete');
  modalActionColor.value = 'error';
  pendingAction.value = deleteAccount;
  showModal.value = true;
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
  @apply w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin;
}

.btn {
  @apply px-4 py-2 rounded font-medium transition-colors inline-flex items-center;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}
</style>
