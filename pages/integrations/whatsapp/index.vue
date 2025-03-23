<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink to="/integrations" class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light mb-2">
          <IconArrowLeft class="w-4 h-4 mr-1" />
          {{ $t('integrations.backToIntegrations') }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $t('integrations.whatsapp.accounts') }}</h1>
      </div>
      <UButton to="/integrations/whatsapp/new" color="primary" class="flex items-center">
        <IconPlus class="w-4 h-4 mr-1" />
        {{ $t('integrations.whatsapp.addAccount') }}
      </UButton>
    </div>

    <!-- Loading state -->
    <div v-if="whatsAppStore.loading" class="py-8 flex justify-center">
      <UIcon name="i-lucide-loader-2" class="text-primary animate-spin h-8 w-8" />
    </div>

    <!-- Error state -->
    <div v-else-if="whatsAppStore.error" class="py-8 flex justify-center">
      <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        {{ whatsAppStore.error }}
        <UButton 
          @click="refreshAccounts" 
          variant="link" 
          color="primary" 
          class="ml-2"
        >
          {{ $t('retry') }}
        </UButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="whatsAppStore.accounts.length === 0" class="py-10 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
        <IconWhatsapp class="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">{{ $t('integrations.whatsapp.noAccounts') }}</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4 text-center max-w-md">
        {{ $t('integrations.whatsapp.addAccountDescription') }}
      </p>
      <UButton to="/integrations/whatsapp/new" color="primary">
        {{ $t('integrations.whatsapp.addAccount') }}
      </UButton>
    </div>

    <!-- Account list -->
    <div v-else class="space-y-4">
      <!-- Active accounts -->
      <div v-if="whatsAppStore.activeAccounts.length > 0">
        <h2 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">{{ $t('integrations.whatsapp.activeAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard 
            v-for="account in whatsAppStore.activeAccounts" 
            :key="account.id" 
            :account="account"
            @view="viewAccount"
            @deactivate="confirmDeactivate"
            @verify="confirmVerify"
          />
        </div>
      </div>

      <!-- Pending accounts -->
      <div v-if="whatsAppStore.pendingAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.pendingAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard 
            v-for="account in whatsAppStore.pendingAccounts" 
            :key="account.id" 
            :account="account"
            @view="viewAccount"
            @deactivate="confirmDeactivate"
            @verify="confirmVerify"
          />
        </div>
      </div>

      <!-- Error accounts -->
      <div v-if="whatsAppStore.errorAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.errorAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard 
            v-for="account in whatsAppStore.errorAccounts" 
            :key="account.id" 
            :account="account"
            @view="viewAccount"
            @deactivate="confirmDeactivate"
            @verify="confirmVerify"
          />
        </div>
      </div>

      <!-- Inactive accounts -->
      <div v-if="whatsAppStore.inactiveAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.inactiveAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard 
            v-for="account in whatsAppStore.inactiveAccounts" 
            :key="account.id" 
            :account="account"
            @view="viewAccount"
            @activate="confirmActivate"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <UModal v-model="showModal">
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
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import { WhatsAppConnectionStatus } from '~/services/whatsapp.service';
import type { WhatsAppAccount } from '~/services/whatsapp.service';
import WhatsAppAccountCard from '~/components/integrations/whatsapp/WhatsAppAccountCard.vue';

// Initialize router
const router = useRouter();

// Initialize i18n
const { t } = useI18n();

// Initialize WhatsApp store
const whatsAppStore = useWhatsAppStore();

// Modal state
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalActionText = ref('');
const modalActionColor = ref<'primary' | 'success' | 'warning' | 'error' | 'info'>('primary');
const pendingAction = ref<() => Promise<void>>(() => Promise.resolve());

// Selected account for actions
const selectedAccount = ref<WhatsAppAccount | null>(null);

// Load WhatsApp accounts on page mount
onMounted(async () => {
  await refreshAccounts();
});

// Refresh accounts list
async function refreshAccounts() {
  await whatsAppStore.loadAccounts();
}

// Navigate to account detail page
function viewAccount(account: WhatsAppAccount) {
  router.push(`/integrations/whatsapp/${account.id}`);
}

// Confirmation handlers
function confirmVerify(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.verifyConnection');
  modalMessage.value = t('integrations.whatsapp.verifyConnectionConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.verify');
  modalActionColor.value = 'primary';
  pendingAction.value = verifyAccount;
  showModal.value = true;
}

function confirmActivate(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.activateAccount');
  modalMessage.value = t('integrations.whatsapp.activateAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.activate');
  modalActionColor.value = 'primary';
  pendingAction.value = activateAccount;
  showModal.value = true;
}

function confirmDeactivate(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.deactivateAccount');
  modalMessage.value = t('integrations.whatsapp.deactivateAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.deactivate');
  modalActionColor.value = 'warning';
  pendingAction.value = deactivateAccount;
  showModal.value = true;
}

function confirmDelete(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.deleteAccount');
  modalMessage.value = t('integrations.whatsapp.deleteAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.delete');
  modalActionColor.value = 'error';
  pendingAction.value = deleteAccount;
  showModal.value = true;
}

// Action handlers
async function verifyAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.verifyConnection(selectedAccount.value.id);
  showModal.value = false;
  await refreshAccounts();
}

async function activateAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.activateAccount(selectedAccount.value.id);
  showModal.value = false;
  await refreshAccounts();
}

async function deactivateAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.deactivateAccount(selectedAccount.value.id);
  showModal.value = false;
  await refreshAccounts();
}

async function deleteAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.deleteAccount(selectedAccount.value.id);
  showModal.value = false;
  await refreshAccounts();
}

// Execute the pending action
async function confirmAction() {
  await pendingAction.value();
}
</script>

<!-- Using UI components for loading spinner - no custom styles needed -->
<style scoped></style>
