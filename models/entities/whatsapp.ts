// WhatsApp entity interfaces
import type { Conversation } from '~/services/inbox.service';

export enum WhatsAppConnectionStatus {
  PENDING = 'PENDING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED'
}

export interface WhatsAppAccount {
  id: string;
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookSecret?: string;
  status: WhatsAppConnectionStatus;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  errorMessage?: string;
  isActive: boolean;
}

export interface WhatsAppAccountFormData {
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookSecret?: string;
}

export interface WhatsAppConnectionResponse {
  success: boolean;
  message: string;
  account?: WhatsAppAccount;
}

export interface WhatsAppApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface WhatsAppConversation extends Conversation {
  whatsappAccountId: string;
  // Any additional WhatsApp-specific fields
}

export type WhatsAppStatusColors = {
  [key in WhatsAppConnectionStatus]: string;
};

// Color scheme for status indicators
export const WhatsAppStatusColors: WhatsAppStatusColors = {
  [WhatsAppConnectionStatus.PENDING]: 'yellow',
  [WhatsAppConnectionStatus.CONNECTED]: 'green',
  [WhatsAppConnectionStatus.ERROR]: 'red',
  [WhatsAppConnectionStatus.DISCONNECTED]: 'gray'
};

export const WhatsAppHelpLinks = {
  accessToken: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
  phoneNumberId: 'https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers',
  businessAccountId: 'https://developers.facebook.com/docs/whatsapp/cloud-api/reference/business-account',
  webhookSecret: 'https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/set-up'
};
