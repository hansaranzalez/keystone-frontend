// services/inbox.service.ts
import { useNuxtApp } from '#app'
import { format } from 'date-fns'

// Define error message keys to avoid using useI18n() in service functions
const ERROR_KEYS = {
  fetchConversations: 'inbox.error.fetchConversations',
  fetchConversation: 'inbox.error.fetchConversation',
  sendMessage: 'inbox.error.sendMessage',
  messageSent: 'inbox.success.messageSent',
  markAsRead: 'inbox.error.markAsRead'
} as const;

// Type for the keys of ERROR_KEYS
type ErrorKeyType = keyof typeof ERROR_KEYS;

// Helper function to get message keys without needing useI18n()
function getErrorKey(key: ErrorKeyType | string): string {
  // First check if it's one of our known keys
  if (key in ERROR_KEYS) {
    return ERROR_KEYS[key as ErrorKeyType];
  }
  // Fallback to the key itself
  return key;
}

// Types
export interface Contact {
  id: string
  name: string
  avatar?: string
  phone?: string
  email?: string
  notes?: string[]
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'document' | 'location'
  url: string
  name?: string
  size?: number
  duration?: number // For audio/video in seconds
  fileType?: string // e.g., 'jpg', 'pdf', 'mp3', etc.
  thumbnail?: string
  previewText?: string
  coordinates?: {
    latitude: number
    longitude: number
  } // For location attachments
}

export interface Message {
  id: string
  content: string
  timestamp: Date
  senderId: string
  channel: 'whatsapp' | 'email' | 'instagram'
  status?: 'sent' | 'delivered' | 'read' | 'failed'
  attachments?: Attachment[]
}

export interface Conversation {
  id: string
  contact: Contact
  messages: Message[]
  lastMessage: {
    content: string
    timestamp: Date
    isUnread: boolean
    channel: 'whatsapp' | 'email' | 'instagram'
  }
}

// Helper functions for accessing dependencies
const getStore = () => {
  try {
    return useNuxtApp().$inboxStore
  } catch (error) {
    console.error('Error getting inbox store:', error)
    return null
  }
}

// Define HTTP client interface to ensure TypeScript recognizes methods like get, post, put, etc.
interface HttpClient {
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
  patch: (url: string, data?: any, config?: any) => Promise<any>;
}

const getHttp = (): HttpClient | null => {
  try {
    // Make sure we're on the client side and the app is ready
    if (process.client && typeof window !== 'undefined') {
      const nuxtApp = useNuxtApp()
      if (nuxtApp && nuxtApp.$http) {
        return nuxtApp.$http as HttpClient
      }
    }
    return null
  } catch (error) {
    console.error('Error getting HTTP client:', error)
    return null
  }
}

const getEndpoints = () => {
  try {
    // Make sure we're on the client side and the app is ready
    if (process.client && typeof window !== 'undefined') {
      const nuxtApp = useNuxtApp()
      if (nuxtApp && nuxtApp.$endpoints) {
        return nuxtApp.$endpoints
      }
    }
    return null
  } catch (error) {
    console.error('Error getting endpoints:', error)
    return null
  }
}

// Translation helper
const getI18nMessageFromKey = (key: string, t?: (key: string) => string): string => {
  if (t) {
    return t(key)
  }
  
  // Fallback for when translation function isn't available
  const messages: Record<string, string> = {
    'inbox.error.fetchConversations': 'Error fetching conversations',
    'inbox.error.fetchConversation': 'Error fetching conversation details',
    'inbox.error.sendMessage': 'Error sending message',
    'inbox.error.markAsRead': 'Error marking conversation as read',
    'inbox.success.messageSent': 'Message sent successfully'
  }
  
  return messages[key] || key
}

// Mock data completely removed - now we're using only the API
// Empty array for type checking purposes only
const mockConversations: Conversation[] = []

/**
 * Fetch all conversations for the current user
 * @returns Promise with conversations data or error
 */
async function fetchConversations(limit = 20, offset = 0, status = 'ACTIVE') {
  const { t } = useI18n()
  
  try {
    // Get dependencies directly from nuxtApp to ensure they're available
    const nuxtApp = useNuxtApp()
    // Apply HttpClient interface to ensure TypeScript recognizes the methods
    const http = nuxtApp.$http as HttpClient
    const endpoints = nuxtApp.$endpoints
    
    if (!http || !endpoints || !endpoints.inbox) {
      console.error('Cannot fetch conversations: Missing dependencies', { http: !!http, endpoints: !!endpoints })
      return { error: getErrorKey('fetchConversations') }
    }
    
    // Call the real API endpoint with query parameters
    const response = await http.get(endpoints.inbox.conversations, {
      params: { limit, offset, status }
    })
    
    // Check response structure and format data to match our application model
    if (response.data && response.data.status === 'success' && response.data.data) {
      // API response may have different structures
      const apiConversations = response.data.data.conversations || response.data.data || [];
      
      // Transform each conversation and log structure for debugging
      console.log('API conversations structure:', JSON.stringify(apiConversations[0], null, 2));
      
      // Transform the backend data format to match our frontend model
      const conversations = Array.isArray(apiConversations) 
        ? apiConversations.map(conv => convertApiConversationToAppModel(conv))
        : [];
        
      return { data: conversations, total: response.data.data.total || conversations.length }
    } else {
      throw new Error('Invalid response format from API')
    }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return { error: getErrorKey('fetchConversations') }
  }
}

/**
 * Fetch a specific conversation by ID
 * @param conversationId ID of the conversation to fetch
 * @returns Promise with conversation data or error
 */
async function fetchConversation(conversationId: string) {
  try {
    // Get dependencies directly from nuxtApp to ensure they're available
    const nuxtApp = useNuxtApp()
    // Apply HttpClient interface to ensure TypeScript recognizes the methods
    const http = nuxtApp.$http as HttpClient
    const endpoints = nuxtApp.$endpoints
    
    if (!http || !endpoints || !endpoints.inbox) {
      console.error('Cannot fetch conversation: Missing dependencies', { http: !!http, endpoints: !!endpoints })
      return { error: getErrorKey('fetchConversation') }
    }
    
    // First get the conversation details
    const conversationResponse = await http.get(endpoints.inbox.conversation(conversationId))
    
    // Then get the messages for this conversation
    const messagesResponse = await http.get(endpoints.inbox.messages(conversationId), {
      params: { limit: 50, offset: 0 }
    })
    
    // Check response structure and add debugging
    console.log('Conversation response:', JSON.stringify(conversationResponse.data, null, 2));
    console.log('Messages response:', JSON.stringify(messagesResponse.data?.data?.messages?.[0], null, 2));
    
    if (conversationResponse.data) {
      // Get the conversation and contact data - handle different possible response structures
      const apiConversation = conversationResponse.data.data?.conversation || 
                             conversationResponse.data.data || 
                             conversationResponse.data;
      
      // Get the messages - handle different possible response structures
      const apiMessages = messagesResponse.data?.data?.messages || 
                         messagesResponse.data?.data || 
                         messagesResponse.data?.messages || 
                         [];
      
      // Log what we're passing to the conversion function
      console.log('Using apiConversation:', apiConversation);
      console.log('Using apiMessages type:', typeof apiMessages, 'isArray:', Array.isArray(apiMessages));
      
      // Transform to our app model
      const conversation = convertApiConversationToAppModel(apiConversation, apiMessages);
      
      return { data: conversation }
    } else {
      throw new Error('Invalid response format from API')
    }
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return { error: getErrorKey('fetchConversation') }
  }
}

// Helper functions section removed - no longer needed with real API data

/**
 * Send a new message in a conversation
 * @param conversationId ID of the conversation
 * @param content Message content
 * @param channel Channel to send the message through
 * @returns Promise with new message data or error
 */
async function sendMessage(
  conversationId: string, 
  content: string, 
  channel: 'whatsapp' | 'email' | 'instagram' = 'whatsapp' // Default to WhatsApp
) {
  try {
    // Get dependencies directly from nuxtApp to ensure they're available
    const nuxtApp = useNuxtApp()
    // Apply HttpClient interface to ensure TypeScript recognizes the methods
    const http = nuxtApp.$http as HttpClient
    const endpoints = nuxtApp.$endpoints
    
    if (!http || !endpoints || !endpoints.inbox) {
      console.error('Cannot send message: Missing dependencies', { http: !!http, endpoints: !!endpoints })
      return { error: getErrorKey('sendMessage') }
    }
    
    // Call the real API to send a message
    const response = await http.post(endpoints.inbox.sendMessage(conversationId), {
      content,
      type: 'text' // As per API docs
    })
    
    if (response.data?.status === 'success') {
      // Create a new message object based on the API response
      const apiMessageId = response.data.data.id
      const whatsappMessageId = response.data.data.whatsapp_message_id
      
      const newMessage: Message = {
        id: apiMessageId,
        content,
        timestamp: new Date(),
        senderId: 'agent', // Current user ID
        channel,
        status: response.data.data.status === 'SENT' ? 'sent' : 'sent', // Use 'sent' as fallback since 'pending' isn't in our type
      }
      
      return { 
        data: newMessage, 
        message: getErrorKey('messageSent') 
      }
    } else {
      throw new Error(response.data?.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return { error: getErrorKey('sendMessage') }
  }
}

/**
 * Mark a conversation as read
 * @param conversationId ID of the conversation to mark as read
 * @returns Promise with success status or error
 */
async function markConversationAsRead(conversationId: string) {
  try {
    // Get dependencies directly from nuxtApp to ensure they're available
    const nuxtApp = useNuxtApp()
    // Apply HttpClient interface to ensure TypeScript recognizes the methods
    const http = nuxtApp.$http as HttpClient
    const endpoints = nuxtApp.$endpoints
    
    if (!http || !endpoints || !endpoints.whatsapp) {
      console.error('Cannot mark conversation as read: Missing dependencies', { http: !!http, endpoints: !!endpoints })
      return { error: getErrorKey('markAsRead') }
    }
    
    // For now use the WhatsApp endpoint until a unified endpoint is available
    // TODO: Add a dedicated endpoint for marking inbox messages as read
    const response = await http.put(endpoints.whatsapp.markAsRead(conversationId))
    
    if (response.data?.status === 'success') {
      return { success: true }
    } else {
      throw new Error(response.data?.message || 'Failed to mark conversation as read')
    }
  } catch (error) {
    console.error('Error marking conversation as read:', error)
    return { error: getErrorKey('markAsRead') }
  }
}

/**
 * Initialize the inbox service
 * This function runs automatically on import
 */
function initInbox() {
  console.log('Initializing inbox service')
  
  // Any initialization code would go here
  // For example, setting up WebSocket connections for real-time messaging
}

// Helper function to convert API response to our app model
function convertApiConversationToAppModel(apiConversation: any, apiMessages: any = []): Conversation {
  // Extract contact information
  const contact: Contact = {
    id: apiConversation.contact_id || apiConversation.contact?.id,
    name: apiConversation.contact ? 
          `${apiConversation.contact.first_name || ''} ${apiConversation.contact.last_name || ''}`.trim() : 
          'Unknown Contact',
    phone: apiConversation.contact?.phone || apiConversation.contact?.whatsapp,
    email: apiConversation.contact?.email,
    avatar: apiConversation.contact?.profile_image_url
  }
  
  // Ensure apiMessages is always an array
  let messagesArray = [];
  
  // Handle different possible shapes of apiMessages
  if (Array.isArray(apiMessages)) {
    messagesArray = apiMessages;
  } else if (apiMessages?.messages && Array.isArray(apiMessages.messages)) {
    messagesArray = apiMessages.messages;
  } else if (apiMessages && typeof apiMessages === 'object') {
    // Log the actual structure for debugging
    console.log('Unexpected apiMessages structure:', apiMessages);
    // Try to convert to array if it's an object with numbered keys
    const keys = Object.keys(apiMessages).filter(key => !isNaN(Number(key)));
    if (keys.length > 0) {
      messagesArray = keys.map(key => apiMessages[key]);
    }
  }
  
  // Convert API messages to our message format
  const messages: Message[] = messagesArray.map((apiMessage: any) => {
    // Skip invalid messages
    if (!apiMessage || typeof apiMessage !== 'object') {
      console.warn('Invalid message object in API response:', apiMessage);
      return null;
    }
    // Determine if message is from user or contact
    const isFromContact = apiMessage.message_type === 'INCOMING'
    
    // Determine channel type
    let channel: 'whatsapp' | 'email' | 'instagram' = 'whatsapp'
    if (apiMessage.source === 'EMAIL') channel = 'email'
    if (apiMessage.source === 'INSTAGRAM') channel = 'instagram'
    
    // Determine message status
    let status: 'sent' | 'delivered' | 'read' | 'failed' = 'sent'
    if (apiMessage.delivered_at) status = 'delivered'
    if (apiMessage.read_at) status = 'read'
    if (apiMessage.error) status = 'failed'
    
    // Create attachments if they exist in metadata
    const attachments: Attachment[] = []
    if (apiMessage.metadata) {
      // Process media attachments based on metadata structure
      if (apiMessage.metadata.media_url) {
        attachments.push({
          id: `att-${apiMessage.id}`,
          type: 'image', // Default to image, but could be determined from MIME type
          url: apiMessage.metadata.media_url,
          name: apiMessage.metadata.filename || 'Attachment',
          fileType: apiMessage.metadata.mime_type?.split('/')[1] || 'jpg',
          size: apiMessage.metadata.size
        })
      }
      
      // Handle document attachments
      if (apiMessage.metadata.document_url) {
        attachments.push({
          id: `doc-${apiMessage.id}`,
          type: 'document',
          url: apiMessage.metadata.document_url,
          name: apiMessage.metadata.filename || 'Document',
          fileType: apiMessage.metadata.mime_type?.split('/')[1] || 'pdf',
          size: apiMessage.metadata.size,
          previewText: apiMessage.metadata.caption
        })
      }
      
      // Handle location data
      if (apiMessage.metadata.latitude && apiMessage.metadata.longitude) {
        attachments.push({
          id: `loc-${apiMessage.id}`,
          type: 'location',
          url: `https://maps.google.com/?q=${apiMessage.metadata.latitude},${apiMessage.metadata.longitude}`,
          name: apiMessage.metadata.location_name || 'Location',
          coordinates: {
            latitude: apiMessage.metadata.latitude,
            longitude: apiMessage.metadata.longitude
          }
        })
      }
    }
    
    try {
      return {
        id: apiMessage.id || `temp-${Date.now()}`, // Fallback ID if missing
        content: apiMessage.content || '',
        timestamp: new Date(apiMessage.sent_at || Date.now()),
        senderId: isFromContact ? contact.id : 'agent',
        channel,
        status,
        attachments: attachments.length > 0 ? attachments : undefined
      }
    } catch (error) {
      console.error('Error processing message:', error, apiMessage);
      return null;
    }
  }).filter(Boolean) as Message[]
  
  // Determine last message info
  let lastMessage = {
    content: 'No messages',
    timestamp: new Date(apiConversation.last_message_at || apiConversation.created_at),
    isUnread: false,
    channel: 'whatsapp' as 'whatsapp' | 'email' | 'instagram'
  }
  
  if (messages.length > 0) {
    // Sort messages by timestamp, newest first
    const sortedMessages = [...messages].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )
    
    const newestMessage = sortedMessages[0]
    lastMessage = {
      content: newestMessage.content,
      timestamp: newestMessage.timestamp,
      isUnread: newestMessage.senderId !== 'agent' && newestMessage.status !== 'read',
      channel: newestMessage.channel
    }
  }
  
  return {
    id: apiConversation.id,
    contact,
    messages: messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()), // Sort by timestamp, oldest first
    lastMessage
  }
}

// Export all functions for use in other modules
export {
  fetchConversations,
  fetchConversation,
  sendMessage,
  markConversationAsRead,
  initInbox,
  convertApiConversationToAppModel
}

// Add debug logging for the fetchConversations function
const originalFetchConversations = fetchConversations;
// @ts-ignore - Replace with enhanced version for debugging
fetchConversations = async (...args: any[]) => {
  try {
    const result = await originalFetchConversations(...args);
    console.log('API response from fetchConversations:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    throw error;
  }
}

// Types are already exported at the top of the file

// Run initialization on import (functional pattern)
// This pattern matches the auth.service.ts implementation
if (process.client) {
  // Only initialize in client-side code
  setTimeout(() => {
    initInbox()
  }, 0)
}
