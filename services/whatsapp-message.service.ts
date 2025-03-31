// WhatsApp Message Service - manages WhatsApp conversations and messages
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import type { 
  Conversation, 
  Message, 
  Attachment 
} from "~/services/inbox.service";
import type { 
  WhatsAppAccount 
} from "~/models/entities/whatsapp";
import { WhatsAppConnectionStatus } from "~/models/entities/whatsapp";

// WhatsApp specific message types
export interface WhatsAppMessageTemplate {
  id: string;
  name: string;
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
}

export interface WhatsAppMediaMessage {
  type: 'image' | 'audio' | 'document' | 'video' | 'sticker';
  url?: string;
  fileData?: File;
  caption?: string;
  filename?: string;
}

// API endpoints for WhatsApp messages - will be replaced with centralized endpoints when available
const baseUrl = "/whatsapp";
let centralizedEndpoints: any = null;

// Default endpoints if centralized ones are not available
type EndpointKey = 'accounts' | 'account' | 'verifyAccount' | 'conversations' | 'conversation' | 'markAsRead' | 
  'messages' | 'sendTextMessage' | 'sendMediaMessage' | 'sendTemplateMessage' | 'templates' | 'template';

const defaultEndpoints: Record<EndpointKey, string | ((...args: any[]) => string)> = {
  // Account Management
  accounts: `${baseUrl}`,
  account: (id: string) => `${baseUrl}/${id}`,
  verifyAccount: (id: string) => `${baseUrl}/${id}/verify`,
  
  // Conversation Management
  conversations: `${baseUrl}/conversations`,
  conversation: (id: string) => `${baseUrl}/conversations/${id}`,
  markAsRead: (id: string) => `${baseUrl}/conversations/${id}/read`,
  
  // Messaging
  messages: (conversationId: string) => `${baseUrl}/conversations/${conversationId}/messages`,
  sendTextMessage: (conversationId: string) => `${baseUrl}/conversations/${conversationId}/messages/text`,
  sendMediaMessage: (conversationId: string) => `${baseUrl}/conversations/${conversationId}/messages/media`,
  sendTemplateMessage: (conversationId: string) => `${baseUrl}/conversations/${conversationId}/messages/template`,
  
  // Templates
  templates: `${baseUrl}/templates`,
  template: (id: string) => `${baseUrl}/templates/${id}`
};

// Helper for HTTP instance using the useHttp composable
const getHttp = () => useHttp().http;

// Helper for multipart uploads using the useHttp composable
const getMultipartHttp = () => {
  // Get standard HTTP instance from useHttp
  const { http } = useHttp();
  
  // For multipart requests, we'll use the existing http instance
  // but override the Content-Type header only when making the request
  return {
    post: (url: string, data: any, config: { headers?: Record<string, string> } = {}) => {
      return http.post(url, data, {
        ...config,
        headers: {
          ...(config.headers || {}),
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  };
};

// Get toast and i18n
const getToast = () => useToast();
const getI18n = () => useI18n();

/**
 * Fetch all WhatsApp conversations for the current user
 * @param accountId Optional WhatsApp account ID to filter by
 */
export const fetchWhatsAppConversations = async (accountId?: string): Promise<{ 
  data?: Conversation[]; 
  error?: string 
}> => {
  const { t } = getI18n();
  
  try {
    let url = getEndpoint('conversations');
    if (accountId) {
      url += `?accountId=${accountId}`;
    }
    
    const response = await getHttp().get(url);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.fetchConversations'));
    }
    
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Error fetching WhatsApp conversations:", error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('inbox.error.fetchConversations')
    };
  }
};

/**
 * Fetch a specific WhatsApp conversation by ID
 * @param conversationId Conversation ID to fetch
 */
export const fetchWhatsAppConversation = async (conversationId: string): Promise<{ 
  data?: Conversation; 
  error?: string 
}> => {
  const { t } = getI18n();
  
  try {
    const response = await getHttp().get(getEndpoint('conversation', conversationId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.fetchConversation'));
    }
    
    return { data: response.data.data || null };
  } catch (error) {
    console.error(`Error fetching WhatsApp conversation ${conversationId}:`, error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('inbox.error.fetchConversation')
    };
  }
};

/**
 * Send a text message via WhatsApp
 * @param conversationId Conversation ID
 * @param message Message text content
 * @param accountId WhatsApp account ID to use for sending
 */
export const sendWhatsAppTextMessage = async (
  conversationId: string, 
  message: string,
  accountId: string
): Promise<{ 
  data?: Message; 
  error?: string 
}> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const payload = {
      accountId,
      type: 'text',
      content: message
    };
    
    const response = await getHttp().post(
      getEndpoint('sendTextMessage', conversationId), 
      payload
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.sendMessage'));
    }
    
    toast.add({
      id: 'whatsapp-message-sent',
      title: t('success'),
      description: t('inbox.success.messageSent'),
      color: 'success'
    });
    
    return { data: response.data.data };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('inbox.error.sendMessage');
    
    toast.add({
      id: 'whatsapp-message-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
    
    console.error("Error sending WhatsApp message:", error);
    return { error: errorMessage };
  }
};

/**
 * Send a media message via WhatsApp
 * @param conversationId Conversation ID
 * @param media Media message data
 * @param accountId WhatsApp account ID to use for sending
 */
export const sendWhatsAppMediaMessage = async (
  conversationId: string, 
  media: WhatsAppMediaMessage,
  accountId: string
): Promise<{ 
  data?: Message; 
  error?: string 
}> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    let mediaUrl = media.url;
    
    // If file data is provided, upload it first
    if (media.fileData && !mediaUrl) {
      const formData = new FormData();
      formData.append('file', media.fileData);
      formData.append('type', media.type);
      formData.append('accountId', accountId);
      
      const uploadResponse = await getMultipartHttp().post(getEndpoint('sendMediaMessage', conversationId), formData);
      
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || t('inbox.error.mediaUpload'));
      }
      
      mediaUrl = uploadResponse.data.data.url;
    }
    
    if (!mediaUrl) {
      throw new Error(t('inbox.error.missingMediaUrl'));
    }
    
    const payload = {
      accountId,
      type: media.type,
      mediaUrl,
      caption: media.caption,
      filename: media.filename
    };
    
    const response = await getHttp().post(
      getEndpoint('sendTextMessage', conversationId), 
      payload
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.sendMessage'));
    }
    
    toast.add({
      id: 'whatsapp-media-sent',
      title: t('success'),
      description: t('inbox.success.mediaSent'),
      color: 'success'
    });
    
    return { data: response.data.data };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('inbox.error.sendMessage');
    
    toast.add({
      id: 'whatsapp-media-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
    
    console.error("Error sending WhatsApp media:", error);
    return { error: errorMessage };
  }
};

/**
 * Send a template message via WhatsApp
 * @param conversationId Conversation ID
 * @param template Template message data
 * @param accountId WhatsApp account ID to use for sending
 */
export const sendWhatsAppTemplateMessage = async (
  conversationId: string, 
  template: WhatsAppMessageTemplate,
  accountId: string
): Promise<{ 
  data?: Message; 
  error?: string 
}> => {
  const { t } = getI18n();
  const toast = getToast();
  
  try {
    const payload = {
      accountId,
      type: 'template',
      template
    };
    
    const response = await getHttp().post(
      getEndpoint('sendTextMessage', conversationId), 
      payload
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.sendMessage'));
    }
    
    toast.add({
      id: 'whatsapp-template-sent',
      title: t('success'),
      description: t('inbox.success.templateSent'),
      color: 'success'
    });
    
    return { data: response.data.data };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('inbox.error.sendMessage');
    
    toast.add({
      id: 'whatsapp-template-error',
      title: t('error'),
      description: errorMessage,
      color: 'error'
    });
    
    console.error("Error sending WhatsApp template:", error);
    return { error: errorMessage };
  }
};

/**
 * Fetch available template messages for a WhatsApp account
 * @param accountId WhatsApp account ID
 */
export const fetchWhatsAppTemplates = async (accountId: string): Promise<{ 
  data?: WhatsAppMessageTemplate[]; 
  error?: string 
}> => {
  const { t } = getI18n();
  
  try {
    const response = await getHttp().get(`${getEndpoint('templates')}?accountId=${accountId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.fetchTemplates'));
    }
    
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('inbox.error.fetchTemplates')
    };
  }
};

/**
 * Mark a WhatsApp conversation as read
 * @param conversationId Conversation ID to mark as read
 * @param accountId WhatsApp account ID
 */
export const markWhatsAppConversationAsRead = async (
  conversationId: string,
  accountId: string
): Promise<{ 
  success?: boolean; 
  error?: string 
}> => {
  const { t } = getI18n();
  
  try {
    const response = await getHttp().post(getEndpoint('markAsRead', conversationId), {
      accountId
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('inbox.error.markAsRead'));
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error marking WhatsApp conversation as read:", error);
    return { 
      error: (error as HTTPError).response?.data?.message || 
             t('inbox.error.markAsRead')
    };
  }
};

/**
 * Convert attachments from WhatsApp format to the inbox service format
 * @param whatsappAttachments WhatsApp API attachment format
 */
export const convertWhatsAppAttachments = (
  whatsappAttachments: any[]
): Attachment[] => {
  return whatsappAttachments.map(attachment => {
    const baseAttachment: Attachment = {
      id: attachment.id,
      type: 'document', // Default type
      url: attachment.url,
      name: attachment.filename || '',
      size: attachment.size || 0,
      fileType: attachment.mime_type?.split('/')[1] || ''
    };
    
    // Set the appropriate type based on mime_type
    if (attachment.mime_type) {
      if (attachment.mime_type.startsWith('image/')) {
        baseAttachment.type = 'image';
        baseAttachment.thumbnail = attachment.url;
      } else if (attachment.mime_type.startsWith('video/')) {
        baseAttachment.type = 'video';
        baseAttachment.duration = attachment.duration || 0;
        baseAttachment.thumbnail = attachment.thumbnail || '';
      } else if (attachment.mime_type.startsWith('audio/')) {
        baseAttachment.type = 'audio';
        baseAttachment.duration = attachment.duration || 0;
      }
    }
    
    // Handle location
    if (attachment.type === 'location') {
      baseAttachment.type = 'location';
      baseAttachment.coordinates = {
        latitude: attachment.latitude,
        longitude: attachment.longitude
      };
    }
    
    return baseAttachment;
  });
};

/**
 * Set the centralized endpoints
 * This should be called from a component or page that has access to the Nuxt context
 */
export const setWhatsAppEndpoints = (endpoints: any): void => {
  centralizedEndpoints = endpoints;
  console.log('WhatsApp service: Centralized endpoints set');
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
  return typeof defaultEndpoint === 'function' ? (defaultEndpoint as (...args: any[]) => string)(...args) : defaultEndpoint as string;
};
