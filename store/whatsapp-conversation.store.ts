// store/whatsapp-conversation.store.ts
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useToast } from "#ui/composables/useToast";
import { useInboxStore, InboxFilters } from "~/store/inbox.store";
import { useWhatsAppStore } from "~/store/whatsapp.store";
import type { 
  WhatsAppConversation, 
  WhatsAppMessage, 
  WhatsAppContact,
  WhatsAppAttachment,
  WhatsAppTemplate,
  WhatsAppAccount
} from "~/models/entities/whatsapp";
import { 
  fetchWhatsAppConversations,
  fetchWhatsAppConversation,
  sendWhatsAppTextMessage,
  sendWhatsAppMediaMessage,
  sendWhatsAppTemplateMessage,
  fetchWhatsAppTemplates,
  markWhatsAppConversationAsRead,
  type WhatsAppMediaMessage
} from "~/services/whatsapp-message.service";

interface WhatsAppConversationState {
  conversations: WhatsAppConversation[];
  activeConversation: WhatsAppConversation | null;
  activeConversationId: string | null;
  activeAccountId: string | null;
  availableTemplates: {
    id: string;
    name: string;
    language: string;
    category: string;
    components: {
      type: "header" | "body" | "footer" | "button";
      text?: string;
      format?: "text" | "image" | "document" | "video";
      parameters?: {
        type: "text" | "currency" | "date_time" | "image" | "document" | "video";
        text?: string;
        placeholder?: string;
        example?: string;
      }[];
    }[];
    status: "PENDING" | "APPROVED" | "REJECTED";
  }[];
  searchQuery: string;
  unreadFilter: boolean;
  loading: {
    conversations: boolean;
    conversation: boolean;
    sendingMessage: boolean;
    templates: boolean;
  };
  error: string | null;
}

export const useWhatsAppConversationStore = defineStore("whatsappConversation", {
  state: (): WhatsAppConversationState => ({
    conversations: [],
    activeConversation: null,
    activeConversationId: null,
    activeAccountId: null,
    availableTemplates: [],
    searchQuery: '',
    unreadFilter: false,
    loading: {
      conversations: false,
      conversation: false,
      sendingMessage: false,
      templates: false
    },
    error: null
  }),

  getters: {
    // Get conversations filtered by search query and read status
    filteredConversations: (state) => {
      let result = [...state.conversations];

      // Apply unread filter
      if (state.unreadFilter) {
        result = result.filter(c => c.unreadCount > 0);
      }

      // Apply search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(c => 
          c.contact.name.toLowerCase().includes(query) || 
          c.lastMessage.content.toLowerCase().includes(query) ||
          (c.profileName && c.profileName.toLowerCase().includes(query)) ||
          (c.contact.phone && c.contact.phone.toLowerCase().includes(query))
        );
      }

      // Sort by most recent message
      result.sort((a, b) => {
        const aDate = new Date(a.lastMessage.timestamp);
        const bDate = new Date(b.lastMessage.timestamp);
        return bDate.getTime() - aDate.getTime();
      });

      return result;
    },

    // Total unread count across all conversations
    totalUnreadCount: (state) => {
      return state.conversations.reduce((count, conv) => count + (conv.unreadCount || 0), 0);
    },

    // Get messages for the active conversation
    activeConversationMessages: (state) => {
      return state.activeConversation?.messages || [];
    },

    // Check if there is an active conversation
    hasActiveConversation: (state) => {
      return !!state.activeConversation;
    },

    // Get the active WhatsApp account
    activeAccount: (state) => {
      const whatsAppStore = useWhatsAppStore();
      if (state.activeAccountId) {
        return whatsAppStore.getAccountById(state.activeAccountId);
      }
      return null;
    },

    // Get all available WhatsApp accounts
    availableAccounts: () => {
      const whatsAppStore = useWhatsAppStore();
      return whatsAppStore.activeAccounts;
    }
  },

  actions: {
    // Set loading state for a specific operation
    setLoading(operation: keyof WhatsAppConversationState['loading'], isLoading: boolean) {
      this.loading[operation] = isLoading;
    },

    // Set error message
    setError(error: string | null) {
      this.error = error;
      
      if (error) {
        const toast = useToast();
        const { t } = useI18n();
        
        toast.add({
          id: 'whatsapp-conversation-error',
          title: t('error'),
          description: error,
          color: 'error'
        });
      }
    },

    // Load all WhatsApp conversations for a specific account
    async loadConversations(accountId?: string) {
      this.setLoading('conversations', true);
      this.error = null;

      try {
        if (accountId) {
          this.activeAccountId = accountId;
        }

        const result = await fetchWhatsAppConversations(this.activeAccountId || undefined);

        if (result.error) {
          this.setError(result.error);
        } else if (result.data) {
          this.conversations = result.data as WhatsAppConversation[];
          
          // Also update the inbox store to include these conversations
          const inboxStore = useInboxStore();
          
          // Only add conversations that aren't already in the inbox store
          const existingIds = new Set(inboxStore.conversations.map(c => c.id));
          const newConversations = this.conversations.filter(c => !existingIds.has(c.id));
          
          if (newConversations.length > 0) {
            inboxStore.conversations.push(...newConversations);
          }
        }
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.fetchConversations'));
        console.error('Error loading WhatsApp conversations:', error);
      } finally {
        this.setLoading('conversations', false);
      }
    },

    // Load a specific conversation by ID
    async loadConversation(conversationId: string, accountId?: string) {
      this.setLoading('conversation', true);
      this.error = null;
      this.activeConversationId = conversationId;

      if (accountId) {
        this.activeAccountId = accountId;
      }

      try {
        const result = await fetchWhatsAppConversation(conversationId);

        if (result.error) {
          this.setError(result.error);
        } else if (result.data) {
          this.activeConversation = result.data as WhatsAppConversation;
          
          // Update the conversation in the list if it exists
          const index = this.conversations.findIndex(c => c.id === conversationId);
          if (index !== -1) {
            this.conversations[index] = this.activeConversation;
          } else {
            // Add to the list if it doesn't exist
            this.conversations.push(this.activeConversation);
          }
          
          // Also update the inbox store
          const inboxStore = useInboxStore();
          const inboxIndex = inboxStore.conversations.findIndex(c => c.id === conversationId);
          
          if (inboxIndex !== -1) {
            inboxStore.conversations[inboxIndex] = this.activeConversation;
          } else {
            inboxStore.conversations.push(this.activeConversation);
          }
          
          // Mark as read in both stores
          if (this.activeConversation.unreadCount > 0) {
            await this.markAsRead(conversationId);
          }
        }
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.fetchConversation'));
        console.error(`Error loading WhatsApp conversation ${conversationId}:`, error);
      } finally {
        this.setLoading('conversation', false);
      }
    },

    // Send a text message
    async sendTextMessage(conversationId: string, content: string) {
      if (!this.activeAccountId) {
        const { t } = useI18n();
        this.setError(t('inbox.error.noActiveAccount'));
        return false;
      }

      this.setLoading('sendingMessage', true);
      this.error = null;

      try {
        const result = await sendWhatsAppTextMessage(
          conversationId, 
          content, 
          this.activeAccountId
        );
        
        if (result.error) {
          this.setError(result.error);
          return false;
        } else if (result.data) {
          // Update the active conversation with the new message
          if (this.activeConversation && this.activeConversationId === conversationId) {
            // Add the message to the conversation
            const newMessage = result.data as WhatsAppMessage;
            this.activeConversation.messages.push(newMessage);
            
            // Update last message
            this.activeConversation.lastMessage = {
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isUnread: false,
              channel: 'whatsapp'
            };
            
            // Update conversation in the list
            const index = this.conversations.findIndex(c => c.id === conversationId);
            if (index !== -1) {
              this.conversations[index] = this.activeConversation;
            }
            
            // Update in inbox store
            const inboxStore = useInboxStore();
            const inboxIndex = inboxStore.conversations.findIndex(c => c.id === conversationId);
            
            if (inboxIndex !== -1) {
              inboxStore.conversations[inboxIndex] = this.activeConversation;
            }
          } else {
            // If the conversation isn't active, reload it
            await this.loadConversation(conversationId);
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.sendMessage'));
        console.error(`Error sending WhatsApp message to ${conversationId}:`, error);
        return false;
      } finally {
        this.setLoading('sendingMessage', false);
      }
    },

    // Send a media message
    async sendMediaMessage(conversationId: string, media: WhatsAppMediaMessage) {
      if (!this.activeAccountId) {
        const { t } = useI18n();
        this.setError(t('inbox.error.noActiveAccount'));
        return false;
      }

      this.setLoading('sendingMessage', true);
      this.error = null;

      try {
        const result = await sendWhatsAppMediaMessage(
          conversationId, 
          media, 
          this.activeAccountId
        );
        
        if (result.error) {
          this.setError(result.error);
          return false;
        } else if (result.data) {
          // Similar update logic as sendTextMessage
          if (this.activeConversation && this.activeConversationId === conversationId) {
            const newMessage = result.data as WhatsAppMessage;
            this.activeConversation.messages.push(newMessage);
            
            this.activeConversation.lastMessage = {
              content: newMessage.content || `[${media.type}]`,
              timestamp: newMessage.timestamp,
              isUnread: false,
              channel: 'whatsapp'
            };
            
            // Update lists
            this.updateConversationInLists(this.activeConversation);
          } else {
            await this.loadConversation(conversationId);
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.sendMedia'));
        console.error(`Error sending WhatsApp media to ${conversationId}:`, error);
        return false;
      } finally {
        this.setLoading('sendingMessage', false);
      }
    },

    // Send a template message
    async sendTemplateMessage(conversationId: string, template: WhatsAppTemplate) {
      if (!this.activeAccountId) {
        const { t } = useI18n();
        this.setError(t('inbox.error.noActiveAccount'));
        return false;
      }

      this.setLoading('sendingMessage', true);
      this.error = null;

      try {
        // Convert the template to the format expected by the API
        const templateData = {
          id: template.id,
          name: template.name,
          components: template.components.map(comp => ({
            type: comp.type,
            parameters: (comp.parameters || []).map(param => {
              // Create properly typed parameter based on parameter type
              switch (param.type) {
                case 'text':
                  return {
                    type: 'text' as const,
                    text: param.placeholder || ''
                  };
                case 'currency':
                  return {
                    type: 'currency' as const,
                    currency: { code: 'USD', amount: 0 }
                  };
                case 'date_time':
                  return {
                    type: 'date_time' as const,
                    date_time: { fallback_value: param.placeholder || '' }
                  };
                case 'image':
                  return {
                    type: 'image' as const,
                    image: { link: param.placeholder || '' }
                  };
                case 'document':
                  return {
                    type: 'document' as const,
                    document: { link: param.placeholder || '' }
                  };
                case 'video':
                  return {
                    type: 'video' as const,
                    video: { link: param.placeholder || '' }
                  };
                default:
                  // Default to text for any unknown types
                  return {
                    type: 'text' as const,
                    text: param.placeholder || ''
                  };
              }
            })
          }))
        };
        
        const result = await sendWhatsAppTemplateMessage(
          conversationId, 
          templateData, 
          this.activeAccountId
        );
        
        if (result.error) {
          this.setError(result.error);
          return false;
        } else if (result.data) {
          // Similar update logic as other send methods
          if (this.activeConversation && this.activeConversationId === conversationId) {
            const newMessage = result.data as WhatsAppMessage;
            this.activeConversation.messages.push(newMessage);
            
            this.activeConversation.lastMessage = {
              content: newMessage.content || `[Template: ${template.name}]`,
              timestamp: newMessage.timestamp,
              isUnread: false,
              channel: 'whatsapp'
            };
            
            // Update lists
            this.updateConversationInLists(this.activeConversation);
          } else {
            await this.loadConversation(conversationId);
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.sendTemplate'));
        console.error(`Error sending WhatsApp template to ${conversationId}:`, error);
        return false;
      } finally {
        this.setLoading('sendingMessage', false);
      }
    },

    // Load available templates for the active account
    async loadTemplates() {
      if (!this.activeAccountId) {
        return;
      }

      this.setLoading('templates', true);
      this.error = null;

      try {
        const result = await fetchWhatsAppTemplates(this.activeAccountId);
        
        if (result.error) {
          this.setError(result.error);
        } else if (result.data) {
          // Add default language, category, and status if not present
          this.availableTemplates = (result.data as any[]).map(template => ({
            ...template,
            language: template.language || 'en_US',
            category: template.category || 'UTILITY',
            status: template.status || 'PENDING'
          }));
        }
      } catch (error) {
        const { t } = useI18n();
        this.setError(t('inbox.error.fetchTemplates'));
        console.error('Error loading WhatsApp templates:', error);
      } finally {
        this.setLoading('templates', false);
      }
    },

    // Mark a conversation as read
    async markAsRead(conversationId: string) {
      if (!this.activeAccountId) {
        return false;
      }

      try {
        const result = await markWhatsAppConversationAsRead(conversationId, this.activeAccountId);
        
        if (result.error) {
          console.error(`Error marking conversation ${conversationId} as read:`, result.error);
          return false;
        }
        
        // Update unread count in our store
        if (this.activeConversation && this.activeConversationId === conversationId) {
          this.activeConversation.unreadCount = 0;
          this.activeConversation.lastMessage.isUnread = false;
        }
        
        // Update in the conversation list
        const index = this.conversations.findIndex(c => c.id === conversationId);
        if (index !== -1) {
          this.conversations[index].unreadCount = 0;
          this.conversations[index].lastMessage.isUnread = false;
        }
        
        // Also update in the inbox store
        const inboxStore = useInboxStore();
        const inboxIndex = inboxStore.conversations.findIndex(c => c.id === conversationId);
        
        if (inboxIndex !== -1) {
          inboxStore.conversations[inboxIndex].lastMessage.isUnread = false;
        }
        
        return true;
      } catch (error) {
        console.error(`Error marking conversation ${conversationId} as read:`, error);
        return false;
      }
    },

    // Helper to update a conversation in both stores
    updateConversationInLists(conversation: WhatsAppConversation) {
      // Update in WhatsApp conversation list
      const index = this.conversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        this.conversations[index] = conversation;
      }
      
      // Update in inbox store
      const inboxStore = useInboxStore();
      const inboxIndex = inboxStore.conversations.findIndex(c => c.id === conversation.id);
      
      if (inboxIndex !== -1) {
        inboxStore.conversations[inboxIndex] = conversation;
      }
    },

    // Set the active account
    setActiveAccount(accountId: string) {
      this.activeAccountId = accountId;
      // Load templates for this account
      this.loadTemplates();
      // Reload conversations for this account
      this.loadConversations();
    },

    // Set search query
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    // Toggle unread filter
    toggleUnreadFilter() {
      this.unreadFilter = !this.unreadFilter;
    },

    // Clear active conversation
    clearActiveConversation() {
      this.activeConversation = null;
      this.activeConversationId = null;
    },

    // Reset store state
    $reset() {
      this.conversations = [];
      this.activeConversation = null;
      this.activeConversationId = null;
      this.availableTemplates = [];
      this.searchQuery = '';
      this.unreadFilter = false;
      this.loading = {
        conversations: false,
        conversation: false,
        sendingMessage: false,
        templates: false
      };
      this.error = null;
    }
  }
});
