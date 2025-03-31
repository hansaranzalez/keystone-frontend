// WhatsApp conversation DTOs for communication with the backend
import { ConversationStatus, MessageSource } from '~/backend/src/types/whatsapp.type';
import type { Contact } from '~/services/inbox.service';

/**
 * DTO for creating a new WhatsApp conversation
 */
export interface CreateWhatsAppConversationDto {
  whatsapp_account_id: string;
  contact_wa_id: string;
  contact_name?: string;
  contact_phone?: string;
}

/**
 * DTO for updating a WhatsApp conversation
 */
export interface UpdateWhatsAppConversationDto {
  status?: ConversationStatus;
  last_message_at?: Date;
}

/**
 * DTO for WhatsApp conversation response
 */
export interface WhatsAppConversationResponseDto {
  id: string;
  whatsapp_account_id: string;
  contact: Contact;
  status: ConversationStatus;
  source: MessageSource.WHATSAPP;
  last_message_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}
