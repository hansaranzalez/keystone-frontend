// WhatsApp message DTOs for communication with the backend
import { MessageType, WhatsAppStatus, MediaType } from '~/backend/src/types/whatsapp.type';

/**
 * DTO for creating a new WhatsApp text message
 */
export interface SendWhatsAppTextMessageDto {
  accountId: string;
  type: 'text';
  content: string;
}

/**
 * DTO for sending a WhatsApp media message
 */
export interface SendWhatsAppMediaMessageDto {
  accountId: string;
  type: MediaType;
  mediaUrl?: string;
  caption?: string;
  filename?: string;
}

/**
 * DTO for sending a WhatsApp template message
 */
export interface SendWhatsAppTemplateMessageDto {
  accountId: string;
  type: 'template';
  template: {
    name: string;
    language: string;
    components: Array<{
      type: 'header' | 'body' | 'footer' | 'button';
      parameters: Array<{
        type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
        text?: string;
        currency?: {
          code: string;
          amount: number;
        };
        date_time?: {
          fallback_value: string;
        };
        image?: {
          link: string;
        };
        document?: {
          link: string;
        };
        video?: {
          link: string;
        };
      }>;
    }>;
  };
}

/**
 * DTO for WhatsApp message response
 */
export interface WhatsAppMessageResponseDto {
  id: string;
  conversation_id: string;
  whatsapp_message_id?: string;
  content: string;
  media_url?: string;
  media_type?: MediaType;
  status: WhatsAppStatus;
  type: MessageType;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

/**
 * DTO for marking a conversation as read
 */
export interface MarkWhatsAppConversationAsReadDto {
  accountId: string;
}
