// WhatsApp entity interfaces
import type { Conversation, Message, Contact, Attachment } from '~/services/inbox.service';

export enum WhatsAppConnectionStatus {
  PENDING = 'PENDING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED'
}

export enum WhatsAppMessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  PENDING = 'pending'
}

export enum WhatsAppMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  LOCATION = 'location',
  CONTACT = 'contact',
  TEMPLATE = 'template',
  INTERACTIVE = 'interactive'
}

export interface WhatsAppAccount {
  id: string;
  name?: string; // Optional in backend response
  phoneNumber: string;
  phoneNumberId?: string; // Optional in backend response
  businessAccountId?: string; // Optional in backend response
  accessToken?: string; // Optional in backend response
  webhookSecret?: string;
  businessName?: string; // Optional business name
  status: WhatsAppConnectionStatus; // Maps from connection_status in backend
  createdAt: string;
  updatedAt?: string; // Optional in backend response
  lastVerifiedAt?: string;
  errorMessage?: string;
  isActive: boolean;
}

export interface WhatsAppAccountFormData {
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookSecret?: string;
  businessName?: string; // Optional business name field
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
  profileName?: string;
  profilePicture?: string;
  businessName?: string;
  lastMessageType?: WhatsAppMessageType;
  unreadCount: number;
  isArchived: boolean;
  isBlocked: boolean;
  isBusiness: boolean;
  labels?: string[];
}

export interface WhatsAppMessage extends Message {
  whatsappAccountId: string;
  whatsappStatus: WhatsAppMessageStatus;
  whatsappMessageId: string;
  whatsappMessageType: WhatsAppMessageType;
  isFromMe: boolean;
  replyToMessageId?: string;
  contextFromMessage?: WhatsAppMessage;
  reactionEmoji?: string;
  templateName?: string;
  templateLanguage?: string;
  templateParams?: Record<string, string>;
  interactiveType?: 'button' | 'list' | 'product' | 'product_list';
  interactiveData?: any;
}

export interface WhatsAppContact extends Contact {
  whatsappId: string;
  profileName?: string;
  isBusiness: boolean;
  businessVertical?: string;
}

export interface WhatsAppAttachment extends Attachment {
  whatsappMediaId?: string;
  mimeType?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: string;
  components: Array<{
    type: 'header' | 'body' | 'footer' | 'button';
    text?: string;
    format?: 'text' | 'image' | 'document' | 'video';
    parameters?: Array<{
      type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
      placeholder: string;
      example?: string;
    }>;
  }>;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface WhatsAppInboxStats {
  totalConversations: number;
  unreadConversations: number;
  todayMessages: number;
  accountDistribution: Record<string, number>;
}

export type WhatsAppStatusColors = {
  [key in WhatsAppConnectionStatus]: string;
};

export type WhatsAppMessageStatusColors = {
  [key in WhatsAppMessageStatus]: string;
};

// Color scheme for status indicators
export const WhatsAppStatusColors: WhatsAppStatusColors = {
  [WhatsAppConnectionStatus.PENDING]: 'yellow',
  [WhatsAppConnectionStatus.CONNECTED]: 'green',
  [WhatsAppConnectionStatus.ERROR]: 'red',
  [WhatsAppConnectionStatus.DISCONNECTED]: 'gray'
};

export const WhatsAppMessageStatusColors: WhatsAppMessageStatusColors = {
  [WhatsAppMessageStatus.SENT]: 'blue',
  [WhatsAppMessageStatus.DELIVERED]: 'blue',
  [WhatsAppMessageStatus.READ]: 'green',
  [WhatsAppMessageStatus.FAILED]: 'red',
  [WhatsAppMessageStatus.PENDING]: 'yellow'
};

export const WhatsAppHelpLinks = {
  accessToken: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
  phoneNumberId: 'https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers',
  businessAccountId: 'https://developers.facebook.com/docs/whatsapp/cloud-api/reference/business-account',
  webhookSecret: 'https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/set-up'
};
