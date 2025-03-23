// WhatsApp Service - Functional Programming Pattern
import axios from "axios";
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
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

// API base URL and endpoints for WhatsApp
const baseUrl = "/api/v1.0.0/whatsapp";
const endpoints = {
  accounts: `${baseUrl}/accounts`,
  account: (id: string) => `${baseUrl}/accounts/${id}`,
  verify: (id: string) => `${baseUrl}/accounts/${id}/verify`,
  activate: (id: string) => `${baseUrl}/accounts/${id}/activate`,
  deactivate: (id: string) => `${baseUrl}/accounts/${id}/deactivate`
};

// Helper for HTTP instance
const getHttp = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Get toast and i18n
const getToast = () => useToast();
const getI18n = () => useI18n();

/**
 * Get all WhatsApp accounts for the current user
 */
export const fetchWhatsAppAccounts = async (): Promise<WhatsAppAccount[]> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().get<WhatsAppApiResponse<WhatsAppAccount[]>>(endpoints.accounts);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.fetchError'));
    }
    
    return response.data.data || [];
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.fetchError');
    toast.add({
      id: 'whatsapp-fetch-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().get<WhatsAppApiResponse<WhatsAppAccount>>(endpoints.account(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.fetchAccountError'));
    }
    
    return response.data.data || null;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.fetchAccountError');
    toast.add({
      id: 'whatsapp-fetch-account-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
    console.error(`Error fetching WhatsApp account ${id}:`, error);
    return null;
  }
};

/**
 * Create a new WhatsApp account
 */
export const createWhatsAppAccount = async (accountData: WhatsAppAccountFormData): Promise<WhatsAppConnectionResponse> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(
      endpoints.accounts,
      accountData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.connectionFailed'));
    }
    
    toast.add({
      id: 'whatsapp-account-created',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.accountCreated'),
      color: 'success'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountCreated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.connectionFailed');
    toast.add({
      id: 'whatsapp-create-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().put<WhatsAppApiResponse<WhatsAppAccount>>(
      endpoints.account(id),
      accountData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.updateFailed'));
    }
    
    toast.add({
      id: 'whatsapp-account-updated',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.accountUpdated'),
      color: 'success'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountUpdated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.updateFailed');
    toast.add({
      id: 'whatsapp-update-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(endpoints.verify(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.connectionFailed'));
    }
    
    toast.add({
      id: 'whatsapp-verified',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.connectionVerified'),
      color: 'success'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.connectionVerified'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.connectionFailed');
    toast.add({
      id: 'whatsapp-verify-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(endpoints.activate(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.activationFailed'));
    }
    
    toast.add({
      id: 'whatsapp-activated',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.accountReactivated'),
      color: 'success'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountReactivated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.activationFailed');
    toast.add({
      id: 'whatsapp-activate-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().post<WhatsAppApiResponse<WhatsAppAccount>>(endpoints.deactivate(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.deactivationFailed'));
    }
    
    toast.add({
      id: 'whatsapp-deactivated',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.accountDeactivated'),
      color: 'warning'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountDeactivated'),
      account: response.data.data
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.deactivationFailed');
    toast.add({
      id: 'whatsapp-deactivate-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
    const response = await getHttp().delete<WhatsAppApiResponse<null>>(endpoints.account(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('integrations.whatsapp.alerts.deleteFailed'));
    }
    
    toast.add({
      id: 'whatsapp-deleted',
      title: t('success'),
      description: t('integrations.whatsapp.alerts.accountDeleted'),
      color: 'info'
    });
    
    return {
      success: true,
      message: t('integrations.whatsapp.alerts.accountDeleted')
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('integrations.whatsapp.alerts.deleteFailed');
    toast.add({
      id: 'whatsapp-delete-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
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
