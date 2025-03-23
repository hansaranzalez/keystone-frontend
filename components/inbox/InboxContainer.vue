<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Responsive layout container -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden pb-safe">

      <!-- Mobile view: Show conversation list when no conversation is selected -->
      <!-- Desktop view: Always show conversation list -->
      <div 
        v-if="!isMobileView || !selectedConversationId" 
        class="w-full lg:w-1/3 lg:border-r border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden"
      >
        <ConversationList 
          :conversations="conversations"
          :selectedId="selectedConversationId"
          :loading="loading"
          @select="handleSelectConversation"
          @new-message="handleNewMessage"
        />
      </div>
      
      <!-- Desktop & Mobile: Right column area -->
      <div class="w-full lg:w-2/3 h-full flex flex-col overflow-hidden">
        <!-- Case 1: Show conversation detail when a conversation is selected and loaded -->
        <ConversationDetail 
          v-if="selectedConversation"
          :conversation="selectedConversation"
          :key="selectedConversationId"
          @back="handleBackToList"
          @send-message="handleSendMessage"
        />
        
        <!-- Case 2: Show loading state while fetching conversation -->
        <div 
          v-else-if="selectedConversationId" 
          class="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800"
        >
          <UIcon name="i-lucide-loader-2" class="text-gray-400 animate-spin h-8 w-8" />
        </div>
        
        <!-- Case 3: Empty state when no conversation is selected (desktop only) -->
        <div 
          v-else-if="!isMobileView"
          class="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden"
        >
          <div class="text-center p-8">
            <UIcon name="i-lucide-mail" class="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">{{ $t('inbox.noConversationSelected') }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.selectConversation') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ConversationList from './ConversationList.vue'
import ConversationDetail from './ConversationDetail.vue'
import type { Conversation } from '~/services/inbox.service'

// Initialize i18n
const { t } = useI18n()

// Track window size for responsive layout
const { width } = useWindowSize()
const isMobileView = computed(() => width.value < 1024)

// State
const loading = ref(false)
const conversations = ref<Conversation[]>([])
const selectedConversationId = ref<string | null>(null)
const selectedConversation = ref<Conversation | null>(null)

// Load conversations (mock data for now)
onMounted(async () => {
  loading.value = true
  try {
    // This would be replaced with a call to a real service
    await new Promise(resolve => setTimeout(resolve, 1000))
    conversations.value = [
      {
        id: '1',
        contact: {
          id: '101',
          name: 'Sarah Smith',
          phone: '(555) 123-4567',
          email: 'sarah@example.com'
        },
        messages: [
          {
            id: '1001',
            content: 'Is the Oak Street property still available?',
            timestamp: new Date('2025-03-15T14:15:00'),
            senderId: '101',
            channel: 'whatsapp'
          },
          {
            id: '1002',
            content: 'Yes, it\'s available! Would you like to schedule a viewing?',
            timestamp: new Date('2025-03-15T14:20:00'),
            senderId: 'agent',
            channel: 'whatsapp'
          },
          {
            id: '1003',
            content: 'Looking at the property right now, it\'s beautiful! How much is the earnest money deposit?',
            timestamp: new Date('2025-03-16T14:30:00'),
            senderId: '101',
            channel: 'whatsapp'
          }
        ],
        lastMessage: {
          content: 'Looking at the property right now, it\'s beautiful! How much is the earnest money deposit?',
          timestamp: new Date('2025-03-16T14:30:00'),
          isUnread: true,
          channel: 'whatsapp'
        }
      },
      {
        id: '2',
        contact: {
          id: '102',
          name: 'John Peterson',
          phone: '(555) 987-6543',
          email: 'john@example.com'
        },
        messages: [
          {
            id: '2001',
            content: 'I\'ll be available next Tuesday afternoon for viewings.',
            timestamp: new Date('2025-03-16T10:45:00'),
            senderId: '102',
            channel: 'email'
          }
        ],
        lastMessage: {
          content: 'I\'ll be available next Tuesday afternoon for viewings.',
          timestamp: new Date('2025-03-16T10:45:00'),
          isUnread: false,
          channel: 'email'
        }
      }
    ]
  } catch (error) {
    console.error('Error loading conversations:', error)
  } finally {
    loading.value = false
  }
})

// Event handlers
const handleSelectConversation = async (id: string) => {
  // Set the selected ID immediately
  selectedConversationId.value = id
  
  try {
    // Find the conversation in our local data
    const selected = conversations.value.find(c => c.id === id)
    if (selected) {
      // Set the selected conversation (this triggers the UI update)
      // Using a new object instead of deep clone to avoid potential reactivity issues
      selectedConversation.value = {
        ...selected,
        messages: [...selected.messages], // shallow copy of messages array
        contact: { ...selected.contact }, // shallow copy of contact object
        lastMessage: { ...selected.lastMessage } // shallow copy of lastMessage object
      }
      
      // Mark as read
      const index = conversations.value.findIndex(c => c.id === id)
      if (index >= 0) {
        conversations.value[index].lastMessage.isUnread = false
      }
      console.log('Conversation loaded successfully:', selectedConversation.value)
    } else {
      console.error(`Conversation with ID ${id} not found`)
      selectedConversation.value = null
    }
  } catch (error) {
    console.error('Error loading conversation:', error)
    selectedConversation.value = null
  }
}

const handleBackToList = () => {
  // On mobile, return to the list view when back button is clicked
  if (isMobileView.value) {
    selectedConversationId.value = null
    selectedConversation.value = null
  }
  // On desktop, we don't need to handle back button clicks
}

const handleSendMessage = (conversationId: string, content: string, channel: 'whatsapp' | 'email' | 'instagram') => {
  // Find the conversation
  const index = conversations.value.findIndex(c => c.id === conversationId)
  if (index === -1) return
  
  // Create new message
  const newMessage = {
    id: `msg-${Date.now()}`,
    content,
    timestamp: new Date(),
    senderId: 'agent', // Current user ID
    channel
  }
  
  // Add message to conversation
  conversations.value[index].messages.push(newMessage)
  
  // Update last message
  conversations.value[index].lastMessage = {
    content,
    timestamp: new Date(),
    isUnread: false,
    channel
  }
  
  // Update the selected conversation if it's the one we're sending a message to
  if (selectedConversation.value && selectedConversation.value.id === conversationId) {
    selectedConversation.value.messages.push(newMessage)
    selectedConversation.value.lastMessage = conversations.value[index].lastMessage
  }
}

const handleNewMessage = () => {
  // This would open a modal or navigate to a new conversation form
  console.log('New message')
}

// Clean up
onBeforeUnmount(() => {
  // Any cleanup needed
})
</script>
