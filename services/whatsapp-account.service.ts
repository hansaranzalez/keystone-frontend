// WhatsApp Account Service - manages WhatsApp business accounts
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import type { WhatsAppAccount, WhatsAppConnectionStatus } from "~/models/entities/whatsapp";
import type { 
  CreateWhatsAppAccountDto,
  UpdateWhatsAppAccountDto,
  WhatsAppAccountResponseDto
} from "~/models/dtos/whatsapp-account.dto";

// API endpoints for WhatsApp accounts - will be replaced with centralized endpoints when available
const baseUrl = "/whatsapp";
let centralizedEndpoints: any = null;

// Default endpoints if centralized ones are not available
type EndpointKey = 'accounts' | 'account' | 'verifyAccount' | 'deactivateAccount' | 'reactivateAccount';

const defaultEndpoints: Record<EndpointKey, string | ((...args: any[]) => string)> = {
  accounts: `${baseUrl}`,
  account: (id: string) => `${baseUrl}/${id}`,
  verifyAccount: (id: string) => `${baseUrl}/${id}/verify`,
  deactivateAccount: (id: string) => `${baseUrl}/${id}/deactivate`,
  reactivateAccount: (id: string) => `${baseUrl}/${id}/reactivate`
};

// Helper for HTTP instance using the useHttp composable
const getHttp = () => useHttp().http;

// Get toast and i18n
const getToast = () => {
  try {
    return useToast();
  } catch (error) {
    return null;
  }
};

const getI18n = () => {
  try {
    return useI18n();
  } catch (error) {
    return null;
  }
};

/**
 * Fetch all WhatsApp accounts for the current user
 */
export const fetchWhatsAppAccounts = async (): Promise<{ 
  data?: WhatsAppAccount[]; 
  error?: string 
}> => {
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().get(getEndpoint('accounts'));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.fetch_accounts_failed'));
    }
    
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.fetch_accounts_failed')
    };
  }
};

/**
 * Fetch a specific WhatsApp account by ID
 * @param accountId Account ID to fetch
 */
export const fetchWhatsAppAccount = async (accountId: string): Promise<{ 
  data?: WhatsAppAccount; 
  error?: string 
}> => {
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().get(getEndpoint('account', accountId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.fetch_account_failed'));
    }
    
    return { data: response.data.data };
  } catch (error) {
    console.error("Error fetching WhatsApp account:", error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.fetch_account_failed')
    };
  }
};

/**
 * Create a new WhatsApp account
 * @param accountData WhatsApp account data
 */
export const createWhatsAppAccount = async (accountData: CreateWhatsAppAccountDto): Promise<{ 
  data?: WhatsAppAccount; 
  error?: string 
}> => {
  const toast = getToast();
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().post(getEndpoint('accounts'), accountData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.create_account_failed'));
    }
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-created',
        title: t('success'),
        description: t('whatsapp.success.account_created'),
        color: 'success'
      });
    }
    
    return { data: response.data.data };
  } catch (error) {
    console.error("Error creating WhatsApp account:", error);
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-creation-error',
        title: t('error'),
        description: (error as HTTPError).response?.data?.message || 
                    t('whatsapp.errors.create_account_failed'),
        color: 'error'
      });
    }
    
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.create_account_failed')
    };
  }
};

/**
 * Update an existing WhatsApp account
 * @param accountId Account ID to update
 * @param accountData Updated WhatsApp account data
 */
export const updateWhatsAppAccount = async (
  accountId: string, 
  accountData: UpdateWhatsAppAccountDto
): Promise<{ 
  data?: WhatsAppAccount; 
  error?: string 
}> => {
  const toast = getToast();
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().put(getEndpoint('account', accountId), accountData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.update_account_failed'));
    }
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-updated',
        title: t('success'),
        description: t('whatsapp.success.account_updated'),
        color: 'success'
      });
    }
    
    return { data: response.data.data };
  } catch (error) {
    console.error("Error updating WhatsApp account:", error);
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-update-error',
        title: t('error'),
        description: (error as HTTPError).response?.data?.message || 
                    t('whatsapp.errors.update_account_failed'),
        color: 'error'
      });
    }
    
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.update_account_failed')
    };
  }
};

/**
 * Verify a WhatsApp account connection
 * @param accountId Account ID to verify
 */
export const verifyWhatsAppAccount = async (accountId: string): Promise<{ 
  success?: boolean; 
  error?: string 
}> => {
  const toast = getToast();
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().post(getEndpoint('verifyAccount', accountId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.verify_account_failed'));
    }
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-verified',
        title: t('success'),
        description: t('whatsapp.success.account_verified'),
        color: 'success'
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error verifying WhatsApp account:", error);
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-verification-error',
        title: t('error'),
        description: (error as HTTPError).response?.data?.message || 
                    t('whatsapp.errors.verify_account_failed'),
        color: 'error'
      });
    }
    
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.verify_account_failed')
    };
  }
};

/**
 * Deactivate a WhatsApp account
 * @param accountId Account ID to deactivate
 */
export const deactivateWhatsAppAccount = async (accountId: string): Promise<{ 
  success?: boolean; 
  error?: string 
}> => {
  const toast = getToast();
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().post(getEndpoint('deactivateAccount', accountId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.deactivate_account_failed'));
    }
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-deactivated',
        title: t('success'),
        description: t('whatsapp.success.account_deactivated'),
        color: 'success'
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deactivating WhatsApp account:", error);
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-deactivation-error',
        title: t('error'),
        description: (error as HTTPError).response?.data?.message || 
                    t('whatsapp.errors.deactivate_account_failed'),
        color: 'error'
      });
    }
    
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.deactivate_account_failed')
    };
  }
};

/**
 * Reactivate a WhatsApp account
 * @param accountId Account ID to reactivate
 */
export const reactivateWhatsAppAccount = async (accountId: string): Promise<{ 
  success?: boolean; 
  error?: string 
}> => {
  const toast = getToast();
  const { t } = getI18n() || { t: (key: string) => key };
  
  try {
    const response = await getHttp().post(getEndpoint('reactivateAccount', accountId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('whatsapp.errors.reactivate_account_failed'));
    }
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-reactivated',
        title: t('success'),
        description: t('whatsapp.success.account_reactivated'),
        color: 'success'
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error reactivating WhatsApp account:", error);
    
    if (toast) {
      toast.add({
        id: 'whatsapp-account-reactivation-error',
        title: t('error'),
        description: (error as HTTPError).response?.data?.message || 
                    t('whatsapp.errors.reactivate_account_failed'),
        color: 'error'
      });
    }
    
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('whatsapp.errors.reactivate_account_failed')
    };
  }
};

/**
 * Set the centralized endpoints
 * This should be called from a component or page that has access to the Nuxt context
 */
export const setWhatsAppAccountEndpoints = (endpoints: any): void => {
  centralizedEndpoints = endpoints;
  console.log('WhatsApp account service: Centralized endpoints set');
};

/**
 * Get the appropriate endpoint
 * Uses centralized endpoints if available, falls back to default endpoints if not
 */
const getEndpoint = (type: EndpointKey, ...args: any[]): string => {
  if (centralizedEndpoints?.whatsapp?.[type]) {
    // Use the centralized endpoint if available
    const endpoint = centralizedEndpoints.whatsapp[type];
    return typeof endpoint === 'function' ? endpoint(...args) : endpoint;
  }
  
  // Fall back to default endpoint
  const defaultEndpoint = defaultEndpoints[type];
  return typeof defaultEndpoint === 'function' ? 
    (defaultEndpoint as (...args: any[]) => string)(...args) : 
    defaultEndpoint as string;
};
