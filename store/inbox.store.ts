// store/inbox.store.ts
import { defineStore } from "pinia"
import { useI18n } from "vue-i18n"
import { 
  fetchConversations, 
  fetchConversation, 
  sendMessage, 
  markConversationAsRead,
  type Conversation
} from "~/services/inbox.service"

export enum InboxFilters {
  ALL = 'all',
  UNREAD = 'unread',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  INSTAGRAM = 'instagram'
}

export enum InboxSortOptions {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  UNREAD = 'unread'
}

interface InboxState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  activeConversation: Conversation | null;
  filter: InboxFilters;
  sortBy: InboxSortOptions;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

export const useInboxStore = defineStore("inbox", {
  state: (): InboxState => ({
    conversations: [],
    selectedConversationId: null,
    activeConversation: null,
    filter: InboxFilters.ALL,
    sortBy: InboxSortOptions.NEWEST,
    searchQuery: '',
    loading: false,
    error: null
  }),

  getters: {
    // Get filtered and sorted conversations
    filteredConversations(state): Conversation[] {
      let result = [...state.conversations]

      // Apply filter
      if (state.filter !== InboxFilters.ALL) {
        if (state.filter === InboxFilters.UNREAD) {
          result = result.filter(c => c.lastMessage.isUnread)
        } else {
          // Filter by channel type
          result = result.filter(c => c.lastMessage.channel === state.filter)
        }
      }

      // Apply search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(c => 
          c.contact.name.toLowerCase().includes(query) || 
          c.lastMessage.content.toLowerCase().includes(query)
        )
      }

      // Apply sorting
      switch (state.sortBy) {
        case InboxSortOptions.NEWEST:
          result.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime())
          break
        case InboxSortOptions.OLDEST:
          result.sort((a, b) => new Date(a.lastMessage.timestamp).getTime() - new Date(b.lastMessage.timestamp).getTime())
          break
        case InboxSortOptions.UNREAD:
          result.sort((a, b) => {
            // First by unread status
            if (a.lastMessage.isUnread && !b.lastMessage.isUnread) return -1
            if (!a.lastMessage.isUnread && b.lastMessage.isUnread) return 1
            // Then by timestamp
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
          })
          break
      }

      return result
    },

    // Count of unread conversations
    unreadCount(state): number {
      return state.conversations.filter(c => c.lastMessage.isUnread).length
    },

    // Get selected conversation
    selectedConversation(state): Conversation | null {
      return state.activeConversation || 
        (state.selectedConversationId ? 
          state.conversations.find(c => c.id === state.selectedConversationId) || null 
          : null)
    },

    // Get counts by channel type
    channelCounts(state): Record<string, number> {
      const counts = {
        whatsapp: 0,
        email: 0,
        instagram: 0
      }

      state.conversations.forEach(c => {
        const channel = c.lastMessage.channel
        if (counts[channel] !== undefined) {
          counts[channel]++
        }
      })

      return counts
    }
  },

  actions: {
    // Loading and error management
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    // Conversation management
    async loadConversations() {
      this.setLoading(true)
      this.error = null

      try {
        const result = await fetchConversations()
        
        if (result.error) {
          this.setError(result.error)
        } else if (result.data) {
          this.conversations = result.data
        }
      } catch (error) {
        const { t } = useI18n()
        this.setError(t('inbox.error.fetchConversations'))
        console.error('Error in loadConversations:', error)
      } finally {
        this.setLoading(false)
      }
    },

    async loadConversation(conversationId: string) {
      this.setLoading(true)
      this.error = null
      this.selectedConversationId = conversationId

      try {
        const result = await fetchConversation(conversationId)
        
        if (result.error) {
          this.setError(result.error)
        } else if (result.data) {
          this.activeConversation = result.data
          
          // Update the conversation in the list if it exists
          const index = this.conversations.findIndex(c => c.id === conversationId)
          if (index !== -1) {
            this.conversations[index] = result.data
          }
          
          // Mark as read
          await this.markAsRead(conversationId)
        }
      } catch (error) {
        const { t } = useI18n()
        this.setError(t('inbox.error.fetchConversation'))
        console.error('Error in loadConversation:', error)
      } finally {
        this.setLoading(false)
      }
    },

    async sendNewMessage(conversationId: string, content: string, channel: 'whatsapp' | 'email' | 'instagram') {
      this.setLoading(true)
      this.error = null

      try {
        const result = await sendMessage(conversationId, content, channel)
        
        if (result.error) {
          this.setError(result.error)
          return false
        } else if (result.data) {
          // If we have the active conversation loaded, add the message to it
          if (this.activeConversation && this.activeConversation.id === conversationId) {
            this.activeConversation.messages.push(result.data)
            
            // Update last message
            this.activeConversation.lastMessage = {
              content: result.data.content,
              timestamp: result.data.timestamp,
              isUnread: false,
              channel: result.data.channel
            }
          }
          
          // Update the conversation in the list
          const index = this.conversations.findIndex(c => c.id === conversationId)
          if (index !== -1) {
            this.conversations[index].lastMessage = {
              content: result.data.content,
              timestamp: result.data.timestamp,
              isUnread: false,
              channel: result.data.channel
            }
          }
          
          return true
        }
        return false
      } catch (error) {
        const { t } = useI18n()
        this.setError(t('inbox.error.sendMessage'))
        console.error('Error in sendNewMessage:', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    async markAsRead(conversationId: string) {
      try {
        const result = await markConversationAsRead(conversationId)
        
        if (result.success) {
          // Update in the conversations list
          const index = this.conversations.findIndex(c => c.id === conversationId)
          if (index !== -1) {
            this.conversations[index].lastMessage.isUnread = false
          }
          
          // Update active conversation if it's the same one
          if (this.activeConversation && this.activeConversation.id === conversationId) {
            this.activeConversation.lastMessage.isUnread = false
          }
        }
      } catch (error) {
        console.error('Error marking conversation as read:', error)
      }
    },

    // Filter and search management
    setFilter(filter: InboxFilters) {
      this.filter = filter
    },

    setSortBy(sortOption: InboxSortOptions) {
      this.sortBy = sortOption
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    // Clear active conversation
    clearActiveConversation() {
      this.activeConversation = null
      this.selectedConversationId = null
    },

    // Reset store state
    $reset() {
      this.conversations = []
      this.selectedConversationId = null
      this.activeConversation = null
      this.filter = InboxFilters.ALL
      this.sortBy = InboxSortOptions.NEWEST
      this.searchQuery = ''
      this.loading = false
      this.error = null
    }
  }
})
