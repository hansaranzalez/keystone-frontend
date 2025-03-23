<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header with search and new message button -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-medium">{{ $t('inbox.conversations') }}</h2>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          size="sm"
          @click="$emit('new-message')"
        >
          {{ $t('inbox.newMessage') }}
        </UButton>
      </div>
      
      <!-- Search input -->
      <UInputGroup>
        <UInput
          v-model="searchQuery"
          :placeholder="$t('inbox.searchPlaceholder')"
          icon="i-lucide-search"
          class="w-full"
        />
      </UInputGroup>
    </div>
    
    <!-- Filter tabs -->
    <div class="px-4 pt-2">
      <UTabs v-model="activeFilter" :items="filterTabs" />
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="text-gray-400 animate-spin h-8 w-8" />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredConversations.length === 0" class="flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div class="text-center">
        <UIcon name="i-lucide-mail-x" class="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h3 class="font-medium text-slate-700 dark:text-slate-300 mb-1">{{ $t('inbox.noConversations') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ getEmptyStateMessage() }}</p>
      </div>
    </div>
    
    <!-- Conversation list -->
    <div v-else class="flex-1 overflow-y-auto">
      <UScrollbars class="h-full">
        <ConversationItem 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          :conversation="conversation"
          :selected="selectedId === conversation.id"
          @click="$emit('select', conversation.id)"
        />
      </UScrollbars>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ConversationItem from './ConversationItem.vue'
import type { Conversation } from '~/services/inbox.service'

// Props and emits
const props = defineProps({
  conversations: {
    type: Array as () => Conversation[],
    required: true
  },
  selectedId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'new-message'])

// i18n
const { t } = useI18n()

// UI State
const searchQuery = ref('')
const activeFilter = ref('all')

// Filter tabs
const filterTabs = [
  {
    label: t('inbox.filters.all'),
    slot: 'all',
    value: 'all',
  },
  {
    label: t('inbox.filters.unread'),
    slot: 'unread',
    value: 'unread',
  },
  {
    label: t('inbox.filters.whatsapp'),
    slot: 'whatsapp',
    value: 'whatsapp',
  },
  {
    label: t('inbox.filters.email'),
    slot: 'email',
    value: 'email',
  },
  {
    label: t('inbox.filters.instagram'),
    slot: 'instagram',
    value: 'instagram',
  }
]

// Filtered conversations based on search and active filter
const filteredConversations = computed(() => {
  let result = [...props.conversations] as Conversation[]
  
  // Apply search filter if there's a query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((conversation: Conversation) => 
      conversation.contact.name.toLowerCase().includes(query) ||
      conversation.lastMessage.content.toLowerCase().includes(query)
    )
  }
  
  // Apply tab filter
  if (activeFilter.value === 'unread') {
    result = result.filter((conversation: Conversation) => conversation.lastMessage.isUnread)
  } else if (activeFilter.value !== 'all') {
    result = result.filter((conversation: Conversation) => conversation.lastMessage.channel === activeFilter.value)
  }
  
  // Sort by most recent message
  return result.sort((a: Conversation, b: Conversation) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  )
})

// Helper methods
const getEmptyStateMessage = () => {
  if (searchQuery.value) {
    return t('inbox.noSearchResults')
  } else if (activeFilter.value === 'unread') {
    return t('inbox.noUnreadMessages')
  } else if (activeFilter.value !== 'all') {
    return t('inbox.noMessagesInChannel', { channel: activeFilter.value })
  } else {
    return t('inbox.startNewConversation')
  }
}
</script>
