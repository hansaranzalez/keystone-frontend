// WhatsApp account DTOs for communication with the backend
import { WhatsAppConnectionStatus } from '../entities/whatsapp';

/**
 * DTO for creating a new WhatsApp account
 * Matches the backend CreateWhatsAppAccountDto
 */
export interface CreateWhatsAppAccountDto {
  phone_number: string;
  phone_number_id: string;
  business_account_id: string;
  access_token: string;
  webhook_secret?: string;
}

/**
 * DTO for updating an existing WhatsApp account
 * Matches the backend UpdateWhatsAppAccountDto
 */
export interface UpdateWhatsAppAccountDto {
  phone_number?: string;
  phone_number_id?: string;
  business_account_id?: string;
  access_token?: string;
  webhook_secret?: string;
  connection_status?: WhatsAppConnectionStatus;
}

/**
 * DTO for WhatsApp account response
 */
export interface WhatsAppAccountResponseDto {
  id: string;
  phone_number: string;
  phone_number_id: string;
  business_account_id: string;
  connection_status: WhatsAppConnectionStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
  error_message?: string;
}
