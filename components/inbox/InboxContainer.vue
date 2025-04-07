<template>
  <div class="h-full">
    <!-- Responsive layout container -->
    <div class="flex-1 flex h-full">

      <!-- Mobile view: Show conversation list when no conversation is selected -->
      <!-- Desktop view: Always show conversation list -->
      <div v-if="!isMobileView || !selectedConversationId"
        class="w-full lg:w-1/3 lg:border-r border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden">
        <ConversationList :conversations="conversations" :selectedId="selectedConversationId || undefined"
          :loading="loading" @select="handleSelectConversation" @new-message="handleNewMessage" />
      </div>

      <!-- Desktop & Mobile: Right column area -->
      <div class="w-full h-full hidden lg:block">
        <!-- Case 1: Show conversation detail when a conversation is selected and loaded -->
        <ConversationDetail v-if="selectedConversation" :conversation="selectedConversation"
          :key="selectedConversationId || undefined" @back="handleBackToList" @send-message="handleSendMessage" />

        <!-- Case 2: Show loading state while fetching conversation -->
        <div v-else-if="selectedConversationId"
          class="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800">
          <UIcon name="i-lucide-loader-2" class="text-gray-400 animate-spin h-8 w-8" />
        </div>

        <!-- Case 3: Empty state when no conversation is selected (desktop only) -->
        <div v-else-if="!isMobileView"
          class="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
          <div class="flex items-center justify-center">
            <div class="text-center space-y-3">
              <UIcon name="i-lucide-mail" class="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">{{
                $t('inbox.noConversationSelected') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.selectConversation') }}</p>
            </div>

          </div>
        </div>
      </div>

      <div class="h-full hidden lg:block">
        <InboxLocalMenu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import ConversationList from './ConversationList.vue'
import ConversationDetail from './ConversationDetail.vue'
import { useInboxStore } from '~/store/inbox.store'
import type { Conversation } from '~/services/inbox.service'

// Initialize i18n
const { t } = useI18n()

// Track window size for responsive layout
const { width } = useWindowSize()
const isMobileView = computed(() => width.value < 1024)

// Get store references
const inboxStore = useInboxStore()
const { conversations, loading, error, selectedConversation } = storeToRefs(inboxStore)
const selectedConversationId = ref<string | null>(null)

// Load conversations from API when component mounts
onMounted(async () => {
  if (conversations.value.length === 0) {
    // Only load if not already loaded
    await inboxStore.loadConversations()
  }

  if (error.value) {
    console.error('Error loading conversations:', error.value)
  }
})

// Watch for changes to the selectedConversationId and load the conversation data
watch(selectedConversationId, async (newId) => {
  if (newId) {
    await inboxStore.loadConversation(newId)
  } else {
    inboxStore.clearActiveConversation()
  }
})

// Event handlers
const handleSelectConversation = async (id: string) => {
  // Set the selected ID immediately which will trigger the watch function to load the conversation
  selectedConversationId.value = id
}

const handleBackToList = () => {
  // On mobile, return to the list view when back button is clicked
  if (isMobileView.value) {
    selectedConversationId.value = null
  }
  // On desktop, we don't need to handle back button clicks
}

const handleSendMessage = async (conversationId: string, content: string, channel: 'whatsapp' | 'email' | 'instagram') => {
  // Use the store action to send the message
  const result = await inboxStore.sendNewMessage(conversationId, content, channel)

  if (result === false) {
    console.error('Failed to send message')
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
