<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import { WhatsAppConnectionStatus } from '~/services/whatsapp.service';
import type { WhatsAppAccount } from '~/services/whatsapp.service';
import WhatsAppAccountCard from '~/components/integrations/whatsapp/WhatsAppAccountCard.vue';
import IntegrationsWhatsappModal from '~/components/ui/modal.vue';
import { setToken, logout, decodeTokenAndSetUser } from '~/services/auth.service';
import { useHttp } from '~/composables/useHttp';

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
const overlay = useOverlay();
const pendingAction = ref<() => Promise<void>>(() => Promise.resolve());
const modal = overlay.create(IntegrationsWhatsappModal, {
  props: {
    modalTitle,
    modalMessage,
    modalActionText,
    modalActionColor,
    confirmAction,
  }
});

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
async function confirmVerify(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.verifyConnection');
  modalMessage.value = t('integrations.whatsapp.verifyConnectionConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.verify');
  modalActionColor.value = 'primary';
  pendingAction.value = verifyAccount;
  await modal.open();
}

async function confirmActivate(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.activateAccount');
  modalMessage.value = t('integrations.whatsapp.activateAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.activate');
  modalActionColor.value = 'primary';
  pendingAction.value = activateAccount;
  await modal.open();
}

async function confirmDeactivate(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.deactivateAccount');
  modalMessage.value = t('integrations.whatsapp.deactivateAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.deactivate');
  modalActionColor.value = 'warning';
  pendingAction.value = deactivateAccount;
  await modal.open();
}

async function confirmDelete(account: WhatsAppAccount) {
  selectedAccount.value = account;
  modalTitle.value = t('integrations.whatsapp.deleteAccount');
  modalMessage.value = t('integrations.whatsapp.deleteAccountConfirmation', { name: account.name });
  modalActionText.value = t('integrations.whatsapp.delete');
  modalActionColor.value = 'error';
  pendingAction.value = deleteAccount;
  await modal.open();
}

// Action handlers
async function verifyAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.verifyConnection(selectedAccount.value.id);
  await refreshAccounts();
  await modal.close();
}

async function activateAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.activateAccount(selectedAccount.value.id);
  await refreshAccounts();
  await modal.close();
}

async function deactivateAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.deactivateAccount(selectedAccount.value.id);
  await refreshAccounts();
  await modal.close();
}

async function deleteAccount() {
  if (!selectedAccount.value) return;
  await whatsAppStore.deleteAccount(selectedAccount.value.id);
  await refreshAccounts();
  await modal.close();
}

// Execute the pending action
async function confirmAction() {
  await pendingAction.value();
}

// Define the type for Facebook Business SDK responses
interface FacebookBusinessLoginResponse {
  status: string;
  authResponse?: {
    accessToken: string;
    userID: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface WhatsAppBusinessAccount {
  id: string;
  name: string;
  verification_status?: string;
  [key: string]: any;
}

interface WhatsAppBusinessAccountsResponse {
  data: WhatsAppBusinessAccount[];
  [key: string]: any;
}

// Direct Facebook login handler that bypasses the SDK plugin
async function directFacebookLogin() {
  console.log('Direct Facebook login button clicked');
  const toast = useToast();
  const config = useRuntimeConfig();

  try {
    if (!window.FB) {
      // Load Facebook SDK directly if not already loaded
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.id = 'facebook-jssdk-direct';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';

        script.onload = () => {
          console.log('Facebook SDK loaded directly');
          if (window.FB) {
            window.FB.init({
              appId: config.public.facebookAppId,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
            resolve();
          } else {
            reject(new Error('Facebook SDK script loaded but FB not defined'));
          }
        };

        script.onerror = (e) => {
          console.error('Error loading Facebook SDK directly:', e);
          reject(new Error('Failed to load Facebook SDK'));
        };

        document.head.appendChild(script);
      });
    }

    console.log('Directly calling FB.login');

    // Call FB.login directly with a user-triggered action
    const response: any = await new Promise((resolve, reject) => {
      window.FB!.login((loginResponse: { authResponse?: { accessToken: string; userID: string; expiresIn?: number; }; status: string; }) => {
        console.log('Direct FB.login response:', loginResponse);
        resolve(loginResponse);
      }, {
        scope: 'whatsapp_business_messaging,whatsapp_business_management,business_management,email',
        config_id: config.public.facebookConfigId
      });
    });

    console.log('Direct login response received:', response);

    if (response && response.status === 'connected') {
      toast.add({
        color: 'success',
        title: t('common.success'),
        description: t('login.facebookLoginSuccess') || 'Successfully connected with Facebook.'
      });

      // Continue with business accounts retrieval here...
    } else {
      toast.add({
        color: 'warning',
        title: t('common.warning'),
        description: t('login.facebookLoginCancelled') || 'Facebook login was cancelled or not completed.'
      });
    }
  } catch (error) {
    console.error('Error during direct Facebook login:', error);
    toast.add({
      color: 'error',
      title: t('common.error'),
      description: t('login.facebookLoginError') || 'Error during Facebook login.'
    });
  }
}

/**
 * Initializes Facebook Business login flow for WhatsApp integration
 * Handles SDK initialization, state preparation, login call, and sending code+state to backend.
 */
async function initFacebookLogin(): Promise<void> {
  console.log('================ FACEBOOK INTEGRATION FLOW STARTED ================');

  // Get dependencies from composables
  const toast = useToast();
  // Assuming translator function exists for localization
  // const translator = (key: string) => key; // Replace with actual translator
  const endpoints = useNuxtApp().$endpoints; // Assuming endpoints includes facebookPrepareState and facebookCallback
  const config = useRuntimeConfig();
  const getHttp = () => useHttp().http;
  const fbBusinessSdk = useNuxtApp().$fbBusinessSdk;

  // Config values
  const FB_APP_ID = config.public.facebookAppId; // Ensure this is set
  const FB_CONFIG_ID = config.public.facebookConfigId; // Ensure this is set

  // --- Helper Function (Example - Adapt to your UI needs) ---
  // You might have existing helpers for this
  const showSuccessToast = (message: string) => toast.add({ color: 'success', title: 'Success', description: message });
  const showErrorToast = (message: string, title: string = 'Error') => toast.add({ color: 'error', title: title, description: message });
  // -------------------------------------------------------------


  // HTTPS check - Facebook Login API requires HTTPS (allow localhost)
  if (window.location.protocol !== 'https:' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')) {
    console.error('Facebook Business SDK requires HTTPS for non-localhost environments');
    showErrorToast('Facebook integration requires a secure connection (HTTPS).');
    return;
  }
  console.log('Running on localhost or HTTPS, proceeding...');

  // Check if SDK is available
  if (!fbBusinessSdk) {
    console.error('Facebook Business SDK plugin is not available');
    showErrorToast('Facebook integration component is not available. Please try again later.');
    return;
  }
  // Ensure required config IDs are present
  if (!FB_APP_ID || !FB_CONFIG_ID) {
    console.error('Missing Facebook App ID or Config ID in configuration.');
    showErrorToast('Facebook integration is not configured correctly.');
    return;
  }
  // Ensure necessary endpoints are defined
  if (!endpoints?.facebookPrepareState || !endpoints?.facebookCallback) {
    console.error('Missing Facebook endpoint configuration.');
    showErrorToast('Facebook integration endpoint configuration is missing.');
    return;
  }


  try {
    // --- State Parameter Logic ---
    // 1. Generate Unique State
    const state = uuidv4();
    console.log(`Generated state: ${state}`);

    // 2. Prepare State on Backend (Associate state with logged-in CRM User)
    try {
      console.log(`Preparing Facebook OAuth state on backend...`);
      // Assumes your http client automatically sends CRM auth (cookie/token)
      await getHttp().post(endpoints.facebookPrepareState, { state });
      console.log("State prepared successfully on backend.");
    } catch (prepareError: any) {
      console.error('Error preparing Facebook OAuth state on backend:', prepareError.response?.data || prepareError.message);
      showErrorToast('Failed to initiate Facebook connection. Please try again.');
      return;
    }

    // --- Facebook Login Call ---
    // 3. Initialize SDK
    console.log('Initializing Facebook Business SDK...');
    await fbBusinessSdk.initialize(); // Ensure this handles potential re-initialization safely
    if (!window.FB || typeof window.FB.login !== 'function') {
      throw new Error('Facebook SDK initialization failed - FB.login not available');
    }

    // 4. Perform Facebook Business login with corrected scope and state
    console.log('Starting Facebook Business Login with permissions and state...');
    const loginResponse: { status: string; authResponse?: { code?: string; userID?: string;[key: string]: any } } = await fbBusinessSdk.login({
      config_id: FB_CONFIG_ID,
      scope: 'whatsapp_business_messaging,whatsapp_business_management,business_management,email,public_profile', // Ensure correct scope
      state: state // Pass the generated state value here
      // No redirect_uri needed usually
    });

    console.log('Facebook Business login response:', loginResponse);

    // --- Handle Response (Focus on Code Flow) ---
    // 5. Process successful login IF code is received
    if (loginResponse.status === 'connected' && loginResponse.authResponse?.code) {
      const code = loginResponse.authResponse.code;
      console.log('Received authorization code, sending to backend callback with state...');

      try {
        // 6. Send Code and State to Backend Callback
        // Construct URL like /auth/facebook/callback?code=...&state=...
        const callbackUrl = endpoints.facebookCallback(code, state); // Use endpoint builder
        const backendResponse = await getHttp().get(callbackUrl); // Use GET

        // 7. Handle Backend Response (Simple Success/Failure for linking)
        if (backendResponse.data?.success) {
          showSuccessToast(backendResponse.data.message || "WhatsApp Business account linked successfully.");
          // Potentially refresh integration status on the page here
        } else {
          // Backend indicated failure
          throw new Error(backendResponse.data?.message || "Failed to link WhatsApp account on the server.");
        }
      } catch (callbackError: any) {
        console.error('Error during backend callback processing:', callbackError.response?.data || callbackError.message);
        // Show specific error from backend if available, otherwise generic
        showErrorToast(callbackError.response?.data?.message || "An error occurred while finalizing the WhatsApp connection.");
      }
    }
    // ** REMOVED: Logic handling direct access token, as code flow is expected/preferred **
    // ** REMOVED: Logic trying to fetch whatsappAccounts on frontend **
    else {
      // Handle cases where login status is not 'connected' or code is missing
      console.error('Facebook login unsuccessful or missing authorization code:', null);
      showErrorToast("Facebook authorization failed or was cancelled.");
    }
  } catch (error: any) {
    // Catch errors from SDK init, FB.login, etc.
    console.error('Facebook Business integration error:', error);
    showErrorToast(error.message || 'An unexpected error occurred during Facebook integration.');
  }
}

/**
 * Helper function to handle backend response
 */
function handleBackendResponse(backendResponse: any, toast: any) {
  // Handle backend response
  if (backendResponse.data?.accessToken) {
    // Update authentication state
    setToken(backendResponse.data.accessToken);

    // Check if there's additional account information
    const accountInfo = backendResponse.data.whatsAppAccount || {};
    const hasAccountDetails = Object.keys(accountInfo).length > 0;

    toast.add({
      color: 'success',
      title: t('login.successTitle'),
      description: hasAccountDetails
        ? `${t('login.whatsappBusinessConnected') || 'WhatsApp Business account'} ${accountInfo.phoneNumber ? `(${accountInfo.phoneNumber})` : ''} successfully connected.`
        : t('login.whatsappBusinessConnected') || 'WhatsApp Business account successfully connected.'
    });

    // Reload page to show connected accounts
    window.location.reload();
  } else {
    throw new Error('Invalid response from server');
  }
}

/**
 * Helper function to show error toast notifications
 */
function showErrorToast(toast: any, message: string) {
  if (toast && toast.add) {
    toast.add({
      color: 'error',
      title: t('common.error'),
      description: message
    });
  } else {
    console.error('Toast notification failed:', message);
  }
}

/**
 * Helper function to extract phone numbers from WhatsApp Business accounts
 * @param {Object} whatsappAccounts - WhatsApp Business accounts response
 * @returns {string[]} - Array of phone numbers
 */
function extractPhoneNumbers(whatsappAccounts: any): string[] {
  if (!whatsappAccounts || !whatsappAccounts.data || !Array.isArray(whatsappAccounts.data)) {
    return [];
  }

  const phoneNumbers: string[] = [];

  try {
    // Extract phone numbers from the accounts data
    // Structure depends on the Facebook API response format
    whatsappAccounts.data.forEach((account: any) => {
      if (account.phone_number || account.phoneNumber) {
        phoneNumbers.push(account.phone_number || account.phoneNumber);
      }

      // Check nested data structures where phone numbers might be stored
      if (account.whatsapp_business_account && account.whatsapp_business_account.phone_numbers) {
        account.whatsapp_business_account.phone_numbers.forEach((phoneObj: any) => {
          if (phoneObj.display_phone_number || phoneObj.phone_number) {
            phoneNumbers.push(phoneObj.display_phone_number || phoneObj.phone_number);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error extracting phone numbers:', error);
  }

  return phoneNumbers;
}
</script>

<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink to="/integrations"
          class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light mb-2">
          <IconArrowLeft class="w-4 h-4 mr-1" />
          {{ $t('integrations.backToIntegrations') }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $t('integrations.whatsapp.accounts') }}</h1>
      </div>

    </div>

    <!-- Loading state -->
    <div v-if="whatsAppStore.loading" class="py-8 flex justify-center">
      <UIcon name="i-lucide-loader-2" class="text-primary animate-spin h-8 w-8" />
    </div>

    <!-- Error state -->
    <div v-else-if="whatsAppStore.error" class="py-8 flex justify-center">
      <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        {{ whatsAppStore.error && whatsAppStore.error.includes('.') ? $t(whatsAppStore.error) : whatsAppStore.error }}
        <UButton @click="refreshAccounts" variant="link" color="primary" class="ml-2">
          {{ $t('retry') }}
        </UButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="whatsAppStore.accounts.length === 0"
      class="py-10 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div
        class="bg-green-100 dark:bg-green-700  rounded-full p-0 w-20 h-20 items-center text-center justify-center flex">
        <UIcon name="i-mdi-whatsapp" class="w-20 text-green-500 h-20"/>
      </div>
      <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">{{ $t('integrations.whatsapp.noAccounts')
        }}</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4 text-center max-w-md">
        {{ $t('integrations.whatsapp.addAccountDescription') }}
      </p>
      <div class="flex space-x-3">
        <UButton icon="i-mdi-facebook" size="xl" @click="initFacebookLogin" color="secondary" variant="soft">
          {{ $t('integrations.whatsapp.connectWhatsAppBusiness') || 'Login with Facebook' }}
        </UButton>
      </div>
    </div>

    <!-- Account list -->
    <div v-else class="space-y-4">
      <!-- Active accounts -->
      <div v-if="whatsAppStore.activeAccounts.length > 0">
        <h2 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">{{
          $t('integrations.whatsapp.activeAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard v-for="account in whatsAppStore.activeAccounts" :key="account.id" :account="account"
            @view="viewAccount" @deactivate="confirmDeactivate" @verify="confirmVerify" />
        </div>
      </div>

      <!-- Pending accounts -->
      <div v-if="whatsAppStore.pendingAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.pendingAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard v-for="account in whatsAppStore.pendingAccounts" :key="account.id" :account="account"
            @view="viewAccount" @deactivate="confirmDeactivate" @verify="confirmVerify" />
        </div>
      </div>

      <!-- Error accounts -->
      <div v-if="whatsAppStore.errorAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.errorAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard v-for="account in whatsAppStore.errorAccounts" :key="account.id" :account="account"
            @view="viewAccount" @deactivate="confirmDeactivate" @verify="confirmVerify" />
        </div>
      </div>

      <!-- Inactive accounts -->
      <div v-if="whatsAppStore.inactiveAccounts.length > 0">
        <h2 class="text-lg font-medium mb-3">{{ $t('integrations.whatsapp.inactiveAccounts') }}</h2>
        <div class="space-y-3">
          <WhatsAppAccountCard v-for="account in whatsAppStore.inactiveAccounts" :key="account.id" :account="account"
            @view="viewAccount" @activate="confirmActivate" @delete="confirmDelete" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Using UI components for loading spinner - no custom styles needed -->
<style scoped></style>
