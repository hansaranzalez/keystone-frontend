<script setup lang="ts">
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
        scope: 'whatsapp_business_messaging,whatsapp_business_management,email',
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
 * Handles SDK initialization, authentication, token exchange, and WhatsApp business account retrieval
 */
async function initFacebookLogin(): Promise<void> {
  console.log('================ FACEBOOK LOGIN FLOW STARTED ================');
  
  // Get dependencies from composables
  const toast = useToast();
  const endpoints = useNuxtApp().$endpoints;
  const config = useRuntimeConfig();
  const { http } = useHttp();
  const fbBusinessSdk = useNuxtApp().$fbBusinessSdk;
  
  // Config values
  const FB_APP_ID = config.public.facebookAppId;
  const FB_CONFIG_ID = config.public.facebookConfigId;
  
  // Token exchange settings
  const TOKEN_EXCHANGE_NEEDED = true; // Flag to indicate if we need to exchange for permanent token
  
  // Feature detection - Check if the endpoints we need are available
  const hasTokenExchangeEndpoint = !!endpoints.facebookExchangeToken;
  
  // HTTPS check - Facebook Login API requires HTTPS
  // Special allowance for localhost development
  if (window.location.protocol !== 'https:' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    console.error('Facebook Business SDK requires HTTPS for non-localhost environments');
    showErrorToast(toast, 'Facebook login requires a secure connection (HTTPS). Please use a secure connection and try again.');
    return;
  }
  
  console.log('Running on localhost, bypassing HTTPS requirement for development');
  
  // Check if SDK is available
  if (!fbBusinessSdk) {
    console.error('Facebook Business SDK plugin is not available');
    showErrorToast(toast, 'Facebook Business SDK is not available. Please try again later.');
    return;
  }
  
  try {
    // Initialize the SDK
    console.log('Initializing Facebook Business SDK...');
    await fbBusinessSdk.initialize();
    
    // Verify SDK initialization
    if (!window.FB || typeof window.FB.login !== 'function') {
      throw new Error('Facebook SDK initialization failed - FB.login not available');
    }
    
    // Perform Facebook Business login with WhatsApp permissions
    console.log('Starting Facebook login with WhatsApp permissions...');
    const loginResponse: { status: string; authResponse?: { accessToken: string; userID: string; [key: string]: any } } = await fbBusinessSdk.login({
      scope: 'whatsapp_business_messaging,whatsapp_business_management,email',
      config_id: FB_CONFIG_ID
    });
    
    console.log('Facebook Business login response:', loginResponse);
    
    // Process successful login
    if (loginResponse.status === 'connected' && loginResponse.authResponse) {
      // Validate auth response
      if (!loginResponse.authResponse.accessToken) {
        // Facebook's authResponse might contain code instead of accessToken when using auth code flow
        if (loginResponse.authResponse.code) {
          console.log('Received authorization code instead of access token, sending to backend');
          
          // Send authorization code to backend for token exchange
          console.log('Sending authorization code to Facebook callback endpoint');
          // Using GET request as the callback endpoint is configured as GET in the backend
          const backendResponse = await http.get(`${config.public.apiUrl}/auth/facebook/callback`, {
            params: {
              // Using 'code' param as expected by the backend Facebook callback endpoint
              code: loginResponse.authResponse.code,
              userID: loginResponse.authResponse.userID || null
              // Don't attempt to get business accounts directly - backend will handle this
            }
          });
          
          handleBackendResponse(backendResponse, toast);
          return;
        } else {
          throw new Error('Authentication response is missing both access token and auth code');
        }
      }
      
      try {
        // Get WhatsApp Business accounts with the received access token
        const whatsappAccounts = await fbBusinessSdk.getWhatsAppBusinessAccounts();
        console.log('WhatsApp Business accounts retrieved:', whatsappAccounts);
        
        // If token exchange is needed, get system user access token with long-lived permission
        let longLivedToken = loginResponse.authResponse.accessToken;
        let tokenMetadata = null;
        
        if (TOKEN_EXCHANGE_NEEDED && hasTokenExchangeEndpoint) {
          try {
            console.log('Exchanging short-lived token for long-lived token...');
            // First, exchange for a long-lived user access token
            const tokenExchangeResponse = await http.post(endpoints.facebookExchangeToken, {
              accessToken: loginResponse.authResponse.accessToken,
              userID: loginResponse.authResponse.userID || null
            });
            
            if (tokenExchangeResponse.data?.longLivedToken) {
              console.log('Successfully exchanged for long-lived token');
              longLivedToken = tokenExchangeResponse.data.longLivedToken;
              tokenMetadata = tokenExchangeResponse.data.metadata || null;
            } else {
              console.warn('Token exchange response missing long-lived token, using short-lived token instead');
            }
          } catch (tokenExchangeError) {
            console.error('Error exchanging token:', tokenExchangeError);
            console.warn('Proceeding with short-lived token');
          }
        }
        
        // Send authentication data to backend with the appropriate token
        console.log('Sending FB authentication data to backend via authenticate endpoint');
        const backendResponse = await http.post(`${config.public.apiUrl}/auth/facebook/authenticate`, {
          accessToken: longLivedToken,
          userID: loginResponse.authResponse.userID || null,
          businessAccounts: whatsappAccounts?.data || [],
          tokenMetadata: tokenMetadata,
          whatsAppPhoneNumbers: extractPhoneNumbers(whatsappAccounts)
        });
        
        handleBackendResponse(backendResponse, toast);
      } catch (accountsError) {
        console.error('Error fetching WhatsApp Business accounts:', accountsError);
        
        // If we can't get accounts directly, attempt token exchange and let backend handle it
        let longLivedToken = loginResponse.authResponse.accessToken;
        let tokenMetadata = null;
        
        if (TOKEN_EXCHANGE_NEEDED && hasTokenExchangeEndpoint) {
          try {
            console.log('Attempting token exchange before fallback...');
            const tokenExchangeResponse = await http.post(`${config.public.apiUrl}/auth/facebook/exchange-token`, {
              accessToken: loginResponse.authResponse.accessToken,
              userID: loginResponse.authResponse.userID || null
            });
            
            if (tokenExchangeResponse.data?.longLivedToken) {
              longLivedToken = tokenExchangeResponse.data.longLivedToken;
              tokenMetadata = tokenExchangeResponse.data.metadata || null;
            }
          } catch (tokenExchangeError) {
            console.error('Error in fallback token exchange:', tokenExchangeError);
          }
        }
        
        // Send to backend with whatever token we have
        console.log('Sending FB authentication data to backend via authenticate endpoint (fallback)');
        const backendResponse = await http.post(`${config.public.apiUrl}/auth/facebook/authenticate`, {
          accessToken: longLivedToken,
          userID: loginResponse.authResponse.userID || null,
          businessAccounts: [],
          tokenMetadata: tokenMetadata
        });
        
        handleBackendResponse(backendResponse, toast);
      }
    } else {
      throw new Error('Facebook login unsuccessful or missing auth data: ' + loginResponse.status);
    }
  } catch (error) {
    console.error('Facebook Business integration error:', error);
    const toast = useToast();
    showErrorToast(
      toast, 
      t('login.facebookLoginError') || 'Error connecting to WhatsApp Business. Please try again later.'
    );
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
        <NuxtLink to="/integrations" class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light mb-2">
          <IconArrowLeft class="w-4 h-4 mr-1" />
          {{ $t('integrations.backToIntegrations') }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $t('integrations.whatsapp.accounts') }}</h1>
      </div>
      <div class="flex space-x-3">
        <UButton to="/integrations/whatsapp/new" color="primary" class="flex items-center">
          <IconPlus class="w-4 h-4 mr-1" />
          {{ $t('integrations.whatsapp.addAccount') }}
        </UButton>
        <UButton @click="initFacebookLogin" color="primary" variant="soft" class="flex items-center bg-[#4267B2] text-white hover:bg-[#385898]">
          <UIcon name="i-mdi-facebook" class="w-4 h-4 mr-1" />
          {{ $t('auth.loginWithFacebook') || 'Login with Facebook' }}
        </UButton>
        <!-- Add a direct login button as fallback -->
        <UButton @click="directFacebookLogin" color="info" variant="soft" class="flex items-center ml-2">
          <UIcon name="i-mdi-facebook" class="w-4 h-4 mr-1" />
          Direct Facebook Login
        </UButton>
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
  </div>
</template>

<!-- Using UI components for loading spinner - no custom styles needed -->
<style scoped></style>
