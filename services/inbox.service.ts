// services/inbox.service.ts
import { useNuxtApp } from '#app'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'

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

const getHttp = () => {
  try {
    return useNuxtApp().$http
  } catch (error) {
    console.error('Error getting HTTP client:', error)
    return null
  }
}

const getEndpoints = () => {
  try {
    return useNuxtApp().$endpoints
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

// Mock data for testing - will be replaced with API calls in production
const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: {
      id: '101',
      name: 'Sara Martínez',
      phone: '(555) 123-4567',
      email: 'sara@ejemplo.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      notes: [
        'Interesada en casas de 3 habitaciones en el distrito Roble',
        'Presupuesto: $450-500K'
      ]
    },
    messages: [
      {
        id: '1001',
        content: '¿Está todavía disponible la propiedad de Calle Roble?',
        timestamp: new Date('2025-03-15T14:15:00'),
        senderId: '101',
        channel: 'whatsapp',
        status: 'read'
      },
      {
        id: '1002',
        content: '¡Sí, está disponible! ¿Te gustaría programar una visita?',
        timestamp: new Date('2025-03-15T14:20:00'),
        senderId: 'agent',
        channel: 'whatsapp',
        status: 'read'
      },
      {
        id: '1003',
        content: 'Estoy viendo la propiedad ahora mismo, ¡es hermosa! ¿Cuánto es el depósito inicial?',
        timestamp: new Date('2025-03-16T14:30:00'),
        senderId: '101',
        channel: 'whatsapp',
        status: 'delivered',
        attachments: [
          {
            id: 'img1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            name: 'Casa_Roble_Frente.jpg',
            fileType: 'jpg',
            size: 1200000
          },
          {
            id: 'img2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
            name: 'Casa_Roble_Cocina.jpg',
            fileType: 'jpg',
            size: 950000
          }
        ]
      },
      {
        id: '1004',
        content: 'El depósito inicial es del 10% del valor de la propiedad. Aquí tienes los detalles financieros.',
        timestamp: new Date('2025-03-16T14:45:00'),
        senderId: 'agent',
        channel: 'whatsapp',
        status: 'delivered',
        attachments: [
          {
            id: 'doc1',
            type: 'document',
            url: '/documents/financial_details.pdf',
            name: 'Detalles_Financieros.pdf',
            fileType: 'pdf',
            size: 2500000,
            previewText: 'Resumen financiero para la propiedad de Calle Roble'
          }
        ]
      }
    ],
    lastMessage: {
      content: 'El depósito inicial es del 10% del valor de la propiedad. Aquí tienes los detalles financieros.',
      timestamp: new Date('2025-03-16T14:45:00'),
      isUnread: true,
      channel: 'whatsapp'
    }
  },
  {
    id: '2',
    contact: {
      id: '102',
      name: 'Juan Pérez',
      phone: '(555) 987-6543',
      email: 'juan@ejemplo.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    messages: [
      {
        id: '2001',
        content: 'Estaré disponible el próximo martes por la tarde para las visitas.',
        timestamp: new Date('2025-03-16T10:45:00'),
        senderId: '102',
        channel: 'email',
        status: 'read'
      },
      {
        id: '2002',
        content: 'Perfecto, he programado la visita para el martes a las 15:00. Aquí tiene el recorrido virtual de la propiedad.',
        timestamp: new Date('2025-03-16T11:30:00'),
        senderId: 'agent',
        channel: 'email',
        status: 'delivered',
        attachments: [
          {
            id: 'vid1',
            type: 'video',
            url: 'https://example.com/videos/property_tour.mp4',
            name: 'Recorrido_Virtual_Propiedad.mp4',
            fileType: 'mp4',
            size: 15000000,
            duration: 180,
            thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
          }
        ]
      },
      {
        id: '2003',
        content: 'Gracias por el recorrido virtual. También me gustaría saber acerca de las opciones de financiamiento.',
        timestamp: new Date('2025-03-17T09:15:00'),
        senderId: '102',
        channel: 'email',
        status: 'read'
      }
    ],
    lastMessage: {
      content: 'Gracias por el recorrido virtual. También me gustaría saber acerca de las opciones de financiamiento.',
      timestamp: new Date('2025-03-17T09:15:00'),
      isUnread: false,
      channel: 'email'
    }
  },
  {
    id: '3',
    contact: {
      id: '103',
      name: 'María García',
      phone: '(555) 333-2222',
      email: 'maria@ejemplo.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    messages: [
      {
        id: '3001',
        content: '¿Cuáles son los costos de cierre de la propiedad de Calle Roble?',
        timestamp: new Date('2025-03-15T09:30:00'),
        senderId: '103',
        channel: 'whatsapp',
        status: 'read'
      },
      {
        id: '3002',
        content: 'Los costos de cierre son aproximadamente el 2-5% del precio de venta. Le envío un desglose detallado.',
        timestamp: new Date('2025-03-15T10:15:00'),
        senderId: 'agent',
        channel: 'whatsapp',
        status: 'read',
        attachments: [
          {
            id: 'doc2',
            type: 'document',
            url: '/documents/closing_costs.pdf',
            name: 'Costos_Cierre_Desglose.pdf',
            fileType: 'pdf',
            size: 1800000
          }
        ]
      },
      {
        id: '3003',
        content: 'Gracias. ¿Podemos hablar por teléfono? Tengo algunas preguntas adicionales.',
        timestamp: new Date('2025-03-15T14:25:00'),
        senderId: '103',
        channel: 'whatsapp',
        status: 'read'
      },
      {
        id: '3004',
        content: 'Acabo de enviarle un mensaje de voz con los detalles adicionales que solicitó.',
        timestamp: new Date('2025-03-21T16:40:00'),
        senderId: 'agent',
        channel: 'whatsapp',
        status: 'delivered',
        attachments: [
          {
            id: 'aud1',
            type: 'audio',
            url: '/audio/property_details.mp3',
            name: 'Detalles_Adicionales.mp3',
            fileType: 'mp3',
            size: 3500000,
            duration: 95
          }
        ]
      }
    ],
    lastMessage: {
      content: 'Acabo de enviarle un mensaje de voz con los detalles adicionales que solicitó.',
      timestamp: new Date('2025-03-21T16:40:00'),
      isUnread: true,
      channel: 'whatsapp'
    }
  },
  {
    id: '4',
    contact: {
      id: '104',
      name: 'Carlos Rodríguez',
      phone: '(555) 444-7777',
      email: 'carlos@ejemplo.com',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    messages: [
      {
        id: '4001',
        content: 'Hola, me interesa la propiedad de Avenida Pino. ¿Podría enviarme más información?',
        timestamp: new Date('2025-03-20T13:10:00'),
        senderId: '104',
        channel: 'instagram',
        status: 'read'
      },
      {
        id: '4002',
        content: '¡Claro! Aquí tienes algunas fotos adicionales y los detalles de la propiedad.',
        timestamp: new Date('2025-03-20T13:45:00'),
        senderId: 'agent',
        channel: 'instagram',
        status: 'delivered',
        attachments: [
          {
            id: 'img3',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
            name: 'Propiedad_Pino_Exterior.jpg',
            fileType: 'jpg',
            size: 1350000
          },
          {
            id: 'img4',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
            name: 'Propiedad_Pino_Interior.jpg',
            fileType: 'jpg',
            size: 1280000
          },
          {
            id: 'loc1',
            type: 'location',
            url: 'https://maps.example.com/location/123456',
            name: 'Ubicación Avenida Pino 123',
            coordinates: {
              latitude: 40.416775,
              longitude: -3.703790
            }
          }
        ]
      },
      {
        id: '4003',
        content: 'Gracias por la información. La ubicación es perfecta para nosotros. ¿Está disponible este fin de semana para una visita?',
        timestamp: new Date('2025-03-21T10:20:00'),
        senderId: '104',
        channel: 'instagram',
        status: 'read'
      }
    ],
    lastMessage: {
      content: 'Gracias por la información. La ubicación es perfecta para nosotros. ¿Está disponible este fin de semana para una visita?',
      timestamp: new Date('2025-03-21T10:20:00'),
      isUnread: true,
      channel: 'instagram'
    }
  },
  {
    id: '5',
    contact: {
      id: '105',
      name: 'Ana Torres',
      phone: '(555) 222-8888',
      email: 'ana@ejemplo.com',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    messages: [
      {
        id: '5001',
        content: 'Estoy buscando una propiedad para inversión en la zona este de la ciudad. ¿Tienen algo disponible?',
        timestamp: new Date('2025-03-18T11:05:00'),
        senderId: '105',
        channel: 'whatsapp',
        status: 'read'
      },
      {
        id: '5002',
        content: 'Tenemos varias opciones que podrían interesarle. Acabo de grabar un video mostrando tres propiedades para inversión.',
        timestamp: new Date('2025-03-18T11:45:00'),
        senderId: 'agent',
        channel: 'whatsapp',
        status: 'delivered',
        attachments: [
          {
            id: 'vid2',
            type: 'video',
            url: 'https://example.com/videos/investment_properties.mp4',
            name: 'Propiedades_Inversión.mp4',
            fileType: 'mp4',
            size: 22000000,
            duration: 240,
            thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
          }
        ]
      }
    ],
    lastMessage: {
      content: 'Tenemos varias opciones que podrían interesarle. Acabo de grabar un video mostrando tres propiedades para inversión.',
      timestamp: new Date('2025-03-18T11:45:00'),
      isUnread: false,
      channel: 'whatsapp'
    }
  }
]

/**
 * Fetch all conversations for the current user
 * @returns Promise with conversations data or error
 */
function fetchConversations() {
  const http = getHttp()
  const endpoints = getEndpoints()
  const { t } = useI18n()
  
  if (!http || !endpoints) {
    console.error('Cannot fetch conversations: Missing dependencies')
    return { error: getI18nMessageFromKey('inbox.error.fetchConversations', t) }
  }
  
  try {
    // In production, this would call the API:
    // const response = await http.get(endpoints.inbox.conversations)
    // return { data: response.data }
    
    // For now, return mock data
    return { data: mockConversations }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return { error: getI18nMessageFromKey('inbox.error.fetchConversations', t) }
  }
}

/**
 * Fetch a specific conversation by ID
 * @param conversationId ID of the conversation to fetch
 * @returns Promise with conversation data or error
 */
function fetchConversation(conversationId: string) {
  const http = getHttp()
  const endpoints = getEndpoints()
  const { t } = useI18n()
  
  if (!http || !endpoints) {
    console.error('Cannot fetch conversation: Missing dependencies')
    return { error: getI18nMessageFromKey('inbox.error.fetchConversation', t) }
  }
  
  try {
    // In production, this would call the API:
    // const response = await http.get(`${endpoints.inbox.conversations}/${conversationId}`)
    // return { data: response.data }
    
    // For now, find in mock data
    const conversation = mockConversations.find(c => c.id === conversationId)
    
    if (!conversation) {
      return { error: getI18nMessageFromKey('inbox.error.conversationNotFound', t) }
    }
    
    return { data: conversation }
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return { error: getI18nMessageFromKey('inbox.error.fetchConversation', t) }
  }
}

// Helper functions
function createTestAttachment(type: string): Attachment | null {
  switch (type) {
    case 'image':
      return {
        id: `img-${Date.now()}`,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        name: 'Foto_Propiedad.jpg',
        fileType: 'jpg',
        size: 1500000
      }
    case 'video':
      return {
        id: `vid-${Date.now()}`,
        type: 'video',
        url: 'https://example.com/videos/property_tour.mp4',
        name: 'Tour_Virtual.mp4',
        fileType: 'mp4',
        size: 18000000,
        duration: 150,
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
      }
    case 'audio':
      return {
        id: `aud-${Date.now()}`,
        type: 'audio',
        url: '/audio/property_details.mp3',
        name: 'Mensaje_De_Voz.mp3',
        fileType: 'mp3',
        size: 2800000,
        duration: 75
      }
    case 'document':
      return {
        id: `doc-${Date.now()}`,
        type: 'document',
        url: '/documents/financial_details.pdf',
        name: 'Documento_Propiedad.pdf',
        fileType: 'pdf',
        size: 3200000,
        previewText: 'Información importante sobre la propiedad...'
      }
    case 'location':
      return {
        id: `loc-${Date.now()}`,
        type: 'location',
        url: 'https://maps.example.com/location/123456',
        name: 'Ubicación de la Propiedad',
        coordinates: {
          latitude: 40.416775,
          longitude: -3.703790
        }
      }
    default:
      return null
  }
}

/**
 * Send a new message in a conversation
 * @param conversationId ID of the conversation
 * @param content Message content
 * @param channel Channel to send the message through
 * @returns Promise with new message data or error
 */
function sendMessage(
  conversationId: string, 
  content: string, 
  channel: 'whatsapp' | 'email' | 'instagram'
) {
  const http = getHttp()
  const endpoints = getEndpoints()
  const { t } = useI18n()
  
  if (!http || !endpoints) {
    console.error('Cannot send message: Missing dependencies')
    return { error: getI18nMessageFromKey('inbox.error.sendMessage', t) }
  }
  
  try {
    // In production, this would call the API:
    // const response = await http.post(`${endpoints.inbox.conversations}/${conversationId}/messages`, {
    //   content,
    //   channel
    // })
    // return { data: response.data, message: getI18nMessageFromKey('inbox.success.messageSent', t) }
    
    // For now, create a mock message
    // Randomly add an attachment sometimes
    const shouldAddAttachment = Math.random() > 0.7
    let attachments = undefined
    
    if (shouldAddAttachment) {
      const attachmentTypes = ['image', 'video', 'audio', 'document', 'location']
      const randomType = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)]
      const attachment = createTestAttachment(randomType)
      
      if (attachment) {
        attachments = [attachment]
      }
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: 'agent', // Current user ID
      channel,
      status: 'sent',
      attachments
    }
    
    return { data: newMessage, message: getI18nMessageFromKey('inbox.success.messageSent', t) }
  } catch (error) {
    console.error('Error sending message:', error)
    return { error: getI18nMessageFromKey('inbox.error.sendMessage', t) }
  }
}

/**
 * Mark a conversation as read
 * @param conversationId ID of the conversation to mark as read
 * @returns Promise with success status or error
 */
function markConversationAsRead(conversationId: string) {
  const http = getHttp()
  const endpoints = getEndpoints()
  const { t } = useI18n()
  
  if (!http || !endpoints) {
    console.error('Cannot mark conversation as read: Missing dependencies')
    return { error: getI18nMessageFromKey('inbox.error.markAsRead', t) }
  }
  
  try {
    // In production, this would call the API:
    // const response = await http.put(`${endpoints.inbox.conversations}/${conversationId}/read`)
    // return { success: true }
    
    // For now, just return success
    return { success: true }
  } catch (error) {
    console.error('Error marking conversation as read:', error)
    return { error: getI18nMessageFromKey('inbox.error.markAsRead', t) }
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

// Export all functions for use in other modules
export {
  fetchConversations,
  fetchConversation,
  sendMessage,
  markConversationAsRead,
  initInbox
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
