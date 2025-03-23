<template>
  <div class="h-full flex flex-col">
    <UPageHeader :title="$t('inbox.conversation')" class="px-4">
      <template #left>
        <UButton 
          icon="i-lucide-arrow-left" 
          color="gray" 
          variant="ghost" 
          class="mr-2"
          @click="handleBack"
        />
      </template>
      <template #right>
        <UPopover :ui="{ width: 'w-72' }" mode="click">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-lucide-user"
            :title="$t('inbox.viewContact')"
          />
          
          <template #content>
            <ContactPanel v-if="conversation?.contact" :contact="conversation.contact" />
          </template>
        </UPopover>
      </template>
    </UPageHeader>
    
    <div class="flex-1 px-4 pb-4">
      <!-- Loading indicator -->
      <div v-if="loading" class="h-full flex items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="text-gray-400 animate-spin h-8 w-8" />
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="h-full flex items-center justify-center">
        <UAlert
          type="error"
          :title="$t('common.error')"
          :description="error"
          class="max-w-lg"
        >
          <template #avatar>
            <UIcon name="i-lucide-alert-circle" />
          </template>
          <template #footer>
            <UButton
              color="red"
              variant="ghost"
              @click="handleRetry"
            >
              {{ $t('common.retry') }}
            </UButton>
          </template>
        </UAlert>
      </div>
      
      <!-- Conversation detail component -->
      <ConversationDetail 
        v-else-if="conversation"
        :conversation="conversation"
        @back="handleBack"
        @send-message="handleSendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '#ui/composables/useToast'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ConversationDetail from '~/components/inbox/ConversationDetail.vue'
import ContactPanel from '~/components/inbox/ContactPanel.vue'
import { useInboxStore } from '~/store/inbox.store'

// Initialize composables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const inboxStore = useInboxStore()
const { loading, error, selectedConversation: conversation } = storeToRefs(inboxStore)

// Get conversation ID from route params
const conversationId = route.params.id as string

// Load conversation data
onMounted(async () => {
  // Reset state
  inboxStore.clearActiveConversation()
  
  // Load conversation details
  await inboxStore.loadConversation(conversationId)
  
  // Show error if any
  if (error.value) {
    toast.error({
      title: t('common.error'),
      description: error.value
    })
  }
})

// Event handlers
const handleBack = () => {
  router.push('/inbox')
}

const handleRetry = async () => {
  await inboxStore.loadConversation(conversationId)
}

const handleSendMessage = async (content: string, channel: 'whatsapp' | 'email' | 'instagram') => {
  const success = await inboxStore.sendNewMessage(conversationId, content, channel)
  
  if (success) {
    toast.success({
      title: t('inbox.messageSent'),
      description: t('inbox.messageSentDescription')
    })
  } else if (error.value) {
    toast.error({
      title: t('common.error'),
      description: error.value
    })
  }
}
</script>
