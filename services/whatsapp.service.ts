// WhatsApp Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";

// Import types from models for internal use
import type {
  WhatsAppAccount, 
  WhatsAppAccountFormData, 
  WhatsAppConnectionResponse,
  WhatsAppApiResponse
} from "~/models/entities/whatsapp";

import { WhatsAppConnectionStatus } from "~/models/entities/whatsapp";

// Re-export types for external use
export type { 
  WhatsAppAccount, 
  WhatsAppAccountFormData, 
  WhatsAppConnectionResponse,
  WhatsAppApiResponse 
};

// Re-export the enum
export { WhatsAppConnectionStatus };

// Use centralized endpoints from the plugin, with fallbacks if not available
let centralizedEndpoints: any = null;

// Default fallback endpoints if centralized ones are not available

// Backend snake_case response to frontend camelCase model
const transformToCamelCase = <T>(data: any): T => {
  if (!data) return {} as T;
  
  if (Array.isArray(data)) {
    return data.map(item => transformToCamelCase<any>(item)) as unknown as T;
  }
  
  if (typeof data !== 'object' || data === null) {
    return data as T;
  }
  
  const transformed: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Special case mappings for property name differences
    let mappedKey = camelKey;
    if (key === 'connection_status') {
      mappedKey = 'status'; // Map connection_status to status as expected by the frontend
    }
    
    // Recursively convert nested objects
    transformed[mappedKey] = typeof value === 'object' && value !== null 
      ? transformToCamelCase(value)
      : value;
  });
  
  // Add default values for required fields if they're missing
  if (!transformed.hasOwnProperty('name')) {
    transformed.name = transformed.phoneNumber || 'WhatsApp Account';
  }
  
  console.log('Transformed object:', transformed);
  return transformed as T;
};

// Default fallback endpoints if centralized ones are not available
const fallbackBaseUrl = "/whatsapp";
const fallbackEndpoints: Record<string, string | ((...args: any[]) => string)> = {
  accounts: `${fallbackBaseUrl}`,
  account: (id: string) => `${fallbackBaseUrl}/${id}`,
  verifyAccount: (id: string) => `${fallbackBaseUrl}/${id}/verify`,
  deactivateAccount: (id: string) => `${fallbackBaseUrl}/${id}/deactivate`,
  reactivateAccount: (id: string) => `${fallbackBaseUrl}/${id}/reactivate`
};

/**
 * Set WhatsApp endpoints from centralized source
 * Called by the WhatsApp plugin during initialization
 */
export const setWhatsAppEndpoints = (endpoints: any) => {
  centralizedEndpoints = endpoints.whatsapp;
  console.log('WhatsApp service using centralized endpoints');
};

// Get the appropriate endpoint based on whether we have centralized endpoints or use fallbacks
const getEndpoint = (key: string, ...args: any[]) => {
  // If centralized endpoints aren't available, use fallbacks
  if (!centralizedEndpoints) {
    console.warn(`WhatsApp service using fallback endpoints - centralized endpoints not available`);
    const fallback = fallbackEndpoints[key];
    if (!fallback) {
      console.error(`No fallback endpoint found for key: ${key}`);
      return '';
    }
    return typeof fallback === 'function' ? fallback(...args) : fallback;
  }
  
  // Use centralized endpoints if available
  const endpoint = centralizedEndpoints[key];
  if (!endpoint) {
    console.error(`Endpoint not found for key: ${key}`);
    return '';
  }
  return typeof endpoint === 'function' ? endpoint(...args) : endpoint;
};

// Helper for HTTP instance using the useHttp composable
const getHttp = () => useHttp().http;

// Get toast and i18n - with proper error handling for Composition API
const getToast = () => {
  try {
    return useToast();
  } catch (error) {
    // Return null if not in a valid composition context
    return null;
  }
};

const getI18n = () => {
  try {
    return useI18n();
  } catch (error) {
    // Return a fallback if not in a valid composition context
    return { t: (key: string) => key };
  }
};

// Utility function to safely show toast notifications
const showToast = (id: string, title: string, description: string, color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral') => {
  const toast = getToast();
  if (toast) {
    toast.add({
      id,
      title,
      description,
      color
    });
  }
};

/**
 * Get all WhatsApp accounts for the current user
 */
export const fetchWhatsAppAccounts = async (): Promise<WhatsAppAccount[]> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().get(getEndpoint('accounts'));
    console.log('WhatsApp accounts response:', response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<WhatsAppAccount[]>(response.data.data || []);
    console.log('Transformed WhatsApp accounts:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.fetchError');
    if (toast) {
      toast.add({
        id: 'whatsapp-fetch-error',
        title: t('error'),
        description: errorMessage,
        color: 'error'
      });
    }
    console.error("Error fetching WhatsApp accounts:", error);
    return [];
  }
};

/**
 * Get a specific WhatsApp account by ID
 */
export const fetchWhatsAppAccount = async (id: string): Promise<WhatsAppAccount | null> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().get(getEndpoint('account', id));
    console.log(`WhatsApp account ${id} response:`, response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.fetchAccountError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<WhatsAppAccount>(response.data.data || null);
    console.log('Transformed WhatsApp account:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.fetchAccountError');
    showToast(
      'whatsapp-fetch-account-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching WhatsApp account ${id}:`, error);
    return null;
  }
};

/**
 * Transform camelCase keys to snake_case for backend compatibility
 */
const transformToSnakeCase = (data: Record<string, any>): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    transformed[snakeKey] = data[key];
  });
  
  return transformed;
};

/**
 * Create a new WhatsApp account
 */
export const createWhatsAppAccount = async (accountData: WhatsAppAccountFormData): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    // Transform the accountData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(accountData);
    console.log('Sending WhatsApp account data:', transformedData);
    
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(
      getEndpoint('accounts'),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.connectionFailed'));
    }
    
    showToast(
      'whatsapp-account-created',
      t('success'),
      t('integrations.whatsapp.alerts.accountCreated'),
      'success'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountCreated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.connectionFailed');
    showToast(
      'whatsapp-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating WhatsApp account:", error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Update an existing WhatsApp account
 */
export const updateWhatsAppAccount = async (id: string, accountData: Partial<WhatsAppAccountFormData>): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    // Transform the accountData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(accountData);
    console.log(`Updating WhatsApp account ${id} with data:`, transformedData);
    
    const response = await getHttp().put<WhatsAppApiResponse<WhatsAppAccount>>(
      getEndpoint('account', id),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.updateFailed'));
    }
    
    showToast(
      'whatsapp-account-updated',
      t('success'),
      t('integrations.whatsapp.alerts.accountUpdated'),
      'success'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountUpdated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.updateFailed');
    showToast(
      'whatsapp-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating WhatsApp account ${id}:`, error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Verify a WhatsApp account connection
 */
export const verifyWhatsAppConnection = async (id: string): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(getEndpoint('verifyAccount', id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.connectionFailed'));
    }
    
    showToast(
      'whatsapp-verified',
      t('success'),
      t('integrations.whatsapp.alerts.connectionVerified'),
      'success'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.connectionVerified'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.connectionFailed');
    showToast(
      'whatsapp-verify-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error verifying WhatsApp account ${id}:`, error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Activate a WhatsApp account
 */
export const activateWhatsAppAccount = async (id: string): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(getEndpoint('reactivateAccount', id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.activationFailed'));
    }
    
    showToast(
      'whatsapp-activated',
      t('success'),
      t('integrations.whatsapp.alerts.accountReactivated'),
      'success'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountReactivated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.activationFailed');
    showToast(
      'whatsapp-activate-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error activating WhatsApp account ${id}:`, error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Deactivate a WhatsApp account
 */
export const deactivateWhatsAppAccount = async (id: string): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(getEndpoint('deactivateAccount', id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.deactivationFailed'));
    }
    
    showToast(
      'whatsapp-deactivated',
      t('success'),
      t('integrations.whatsapp.alerts.accountDeactivated'),
      'warning'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountDeactivated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.deactivationFailed');
    showToast(
      'whatsapp-deactivate-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deactivating WhatsApp account ${id}:`, error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Delete a WhatsApp account
 */
export const deleteWhatsAppAccount = async (id: string): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().delete<WhatsAppApiResponse<null>>(getEndpoint('account', id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.deleteFailed'));
    }
    
    showToast(
      'whatsapp-deleted',
      t('success'),
      t('integrations.whatsapp.alerts.accountDeleted'),
      'info'
    );
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountDeleted')
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.deleteFailed');
    showToast(
      'whatsapp-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting WhatsApp account ${id}:`, error);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Format phone number for display (shows only last 4 digits)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Keep only the last 4 digits visible
  const lastFourDigits = phoneNumber.slice(-4);
  const maskedPart = phoneNumber.slice(0, -4).replace(/\d/g, '*');
  
  return `${maskedPart}${lastFourDigits}`;
};

/**
 * Format token for display (shows only first and last few characters)
 */
export const formatToken = (token: string): string => {
  if (!token) return '';
  
  // Keep only the first 4 and last 4 characters visible
  if (token.length <= 10) return token;
  
  const firstFourChars = token.slice(0, 4);
  const lastFourChars = token.slice(-4);
  
  return `${firstFourChars}...${lastFourChars}`;
};

// Initialize WhatsApp service if needed
export const initWhatsApp = async (): Promise<void> => {
  // Any initialization logic here
  console.log("WhatsApp service initialized");
};
