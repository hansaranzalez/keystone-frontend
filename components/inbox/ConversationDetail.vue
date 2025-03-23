<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header with contact info and back button -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center bg-white dark:bg-slate-900">
      <!-- Back button (mobile only) -->
      <UButton
        v-show="isMobileView"
        color="neutral"
        variant="ghost"
        icon="i-lucide-chevron-left"
        class="mr-2"
        @click="$emit('back')"
      />
      
      <!-- Contact info -->
      <UAvatar
        :alt="conversation.contact.name"
        :src="conversation.contact.avatar"
        size="md"
        class="mr-3 flex-shrink-0"
      />
      
      <div class="flex-1 min-w-0">
        <h3 class="font-medium truncate">{{ conversation.contact.name }}</h3>
        <div class="flex items-center mt-0.5">
          <ChannelIndicator :channel="activeChannel" class="mr-2" />
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ channelStatus }}
          </span>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex items-center ml-2 space-x-2">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-phone"
          class="hidden sm:flex"
          :title="$t('inbox.call')"
        />
        
        <UPopover mode="click">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            class="hidden sm:flex"
            :title="$t('inbox.viewContact')"
          />
          
          <template #content>
            <ContactPanel :contact="conversation.contact" />
          </template>
        </UPopover>
        
        <UDropdown
          :items="actionMenuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-more-vertical"
          />
        </UDropdown>
      </div>
    </div>
    
    <!-- Message history -->
    <div class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 pb-safe">
      <UScrollbars class="h-full" key="conversation-scrollbar">
        <div class="space-y-4 min-h-full flex flex-col justify-end pb-4">
          <div v-if="groupedMessages.length === 0" class="flex-1 flex items-center justify-center">
            <div class="text-center p-4">
              <UIcon name="i-lucide-message-square" class="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 class="font-medium text-slate-700 dark:text-slate-300 mb-1">{{ $t('inbox.noMessages') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.startConversation') }}</p>
            </div>
          </div>
          
          <template v-for="(group, groupIndex) in groupedMessages" :key="groupIndex">
            <!-- Date divider -->
            <DateDivider :date="group.date" />
            
            <!-- Messages for this date -->
            <div class="space-y-2">
              <MessageItem
                v-for="message in group.messages"
                :key="message.id"
                :message="message"
                :contact="conversation.contact"
                @open-attachment="handleAttachmentOpen"
              />
            </div>
          </template>
        </div>
      </UScrollbars>
    </div>
    
    <!-- Message composer -->
    <MessageComposer 
      :conversation-id="conversation.id"
      :active-channel="activeChannel"
      @send="handleSendMessage"
      @change-channel="activeChannel = $event"
    />
  </div>
  
  <!-- Attachment Modal -->
  <UModal v-model="showAttachmentModal" prevent-close>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">
            {{ currentAttachment?.name || t('inbox.attachment') }}
          </h3>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="closeAttachmentModal" />
        </div>
      </template>
      
      <div v-if="currentAttachment" class="max-w-lg">
        <!-- Image Attachment -->
        <div v-if="currentAttachment.type === 'image'" class="flex justify-center">
          <img 
            :src="currentAttachment.url" 
            :alt="currentAttachment.name || 'Imagen'" 
            class="max-h-96 max-w-full object-contain rounded-lg"
          />
        </div>
        
        <!-- Video Attachment -->
        <div v-else-if="currentAttachment.type === 'video'" class="flex justify-center">
          <video 
            :src="currentAttachment.url" 
            controls 
            class="max-h-96 max-w-full rounded-lg"
          ></video>
        </div>
        
        <!-- Audio Attachment -->
        <div v-else-if="currentAttachment.type === 'audio'" class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div class="flex items-center mb-3">
            <UIcon name="i-lucide-headphones" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
            <div>
              <div class="font-medium">{{ currentAttachment.name || t('inbox.audioMessage') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ currentAttachment.duration ? formatDuration(currentAttachment.duration) : '' }}
              </div>
            </div>
          </div>
          <audio 
            :src="currentAttachment.url" 
            controls 
            class="w-full"
          ></audio>
        </div>
        
        <!-- Document Attachment -->
        <div v-else-if="currentAttachment.type === 'document'" class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-lucide-file-text" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
            <div class="flex-1">
              <div class="font-medium">{{ currentAttachment.name }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ formatFileSize(currentAttachment.size) }}
              </div>
            </div>
            <UButton 
              icon="i-lucide-download" 
              color="primary" 
              variant="ghost" 
              :href="currentAttachment.url" 
              target="_blank"
            />
          </div>
          <div v-if="currentAttachment.previewText" class="mt-4 p-4 bg-white dark:bg-slate-700 rounded border dark:border-slate-600 text-sm">
            <p class="whitespace-pre-wrap">{{ currentAttachment.previewText }}</p>
          </div>
        </div>
        
        <!-- Location Attachment -->
        <div v-else-if="currentAttachment.type === 'location'" class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div class="flex items-center mb-3">
            <UIcon name="i-lucide-map-pin" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
            <div>
              <div class="font-medium">{{ currentAttachment.name || t('inbox.location') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ currentAttachment.coordinates?.latitude }}, {{ currentAttachment.coordinates?.longitude }}
              </div>
            </div>
          </div>
          <div class="bg-slate-200 dark:bg-slate-700 h-60 flex items-center justify-center rounded-lg">
            <p class="text-center text-slate-500 dark:text-slate-400">
              {{ t('inbox.mapPreviewNotAvailable') }}
              <br />
              <UButton 
                class="mt-2" 
                icon="i-lucide-external-link" 
                :label="t('inbox.openInMaps')" 
                color="primary" 
                size="sm"
                :href="`https://maps.google.com/?q=${currentAttachment.coordinates?.latitude},${currentAttachment.coordinates?.longitude}`" 
                target="_blank"
              />
            </p>
          </div>
        </div>
        
        <!-- Unknown Attachment Type -->
        <div v-else class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
          <UIcon name="i-lucide-help-circle" class="h-16 w-16 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
          <p>{{ t('inbox.unknownAttachmentType') }}</p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <UButton @click="closeAttachmentModal">{{ t('common.close') }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
// Import format functions manually to avoid TypeScript issues
const format = (date: Date, formatStr: string): string => {
  // Simple date formatter implementation
  const pad = (n: number) => n < 10 ? `0${n}` : `${n}`
  
  // Parse the format string
  return formatStr
    .replace('yyyy', `${date.getFullYear()}`)
    .replace('MM', pad(date.getMonth() + 1))
    .replace('dd', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()))
}

// Check if two dates are on the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ChannelIndicator from './ChannelIndicator.vue'
import DateDivider from './DateDivider.vue'
import MessageItem from './MessageItem.vue'
import MessageComposer from './MessageComposer.vue'
import ContactPanel from './ContactPanel.vue'
import type { Conversation, Message } from '~/services/inbox.service'

// Props
const props = defineProps({
  conversation: {
    type: Object as () => Conversation,
    required: true
  }
})


// i18n
const { t } = useI18n()

// Responsive state
const { width } = useWindowSize()
const isMobileView = computed(() => width.value < 1024)

// Local state
const activeChannel = ref(props.conversation.lastMessage?.channel || 'whatsapp')

// Computed properties
const channelStatus = computed(() => {
  // You would get this from the channel status API in a real app
  return t('inbox.activeNow')
})

interface MessageGroup {
  date: Date;
  messages: Message[];
}

interface MessageGroups {
  [key: string]: MessageGroup;
}

// Helper functions for attachments
const formatFileSize = (sizeInBytes?: number): string => {
  if (!sizeInBytes) return ''
  
  const kb = sizeInBytes / 1024
  if (kb < 1024) {
    return `${Math.round(kb)} KB`
  }
  
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return ''
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Group messages by date
const groupedMessages = computed(() => {
  if (!props.conversation.messages) return [] as MessageGroup[]
  
  const groups = props.conversation.messages.reduce((acc: MessageGroups, message: Message) => {
    const messageDate = new Date(message.timestamp)
    const dateStr = format(messageDate, 'yyyy-MM-dd')
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: messageDate,
        messages: []
      }
    }
    
    acc[dateStr].messages.push(message)
    return acc
  }, {} as MessageGroups)
  
  // Convert to array and sort by date
  return Object.values(groups).sort((a: MessageGroup, b: MessageGroup) => a.date.getTime() - b.date.getTime())
})

// Action menu items
const actionMenuItems = [
  {
    label: t('inbox.actions.archive'),
    icon: 'i-lucide-archive',
    click: () => {/* Implementation */}
  },
  {
    label: t('inbox.actions.markUnread'),
    icon: 'i-lucide-mail',
    click: () => {/* Implementation */}
  },
  {
    label: t('inbox.actions.block'),
    icon: 'i-lucide-ban',
    click: () => {/* Implementation */}
  }
]

// Local state for handling attachments
const showAttachmentModal = ref(false)
const currentAttachment = ref<any>(null)

// Event handlers
const handleSendMessage = (content: string) => {
  // Emit to parent component
  const channel = activeChannel.value
  const conversationId = props.conversation.id
  
  if (content.trim()) {
    // We'll emit this to be handled by the parent component
    // In a real app, this would call a service to send the message
    // via the appropriate channel (whatsapp, email, etc.)
    // Then we would add the message to the conversation via a store
    // or wait for a WebSocket to deliver the message
    
    // For now, just emit the event
    // which simulates successfully sending the message
    // and receiving it back
    // @see InboxContainer.vue on how this is handled
    emit('send-message', conversationId, content, channel)
  }
}

// Handle attachment open
const handleAttachmentOpen = (attachment: any) => {
  currentAttachment.value = attachment
  showAttachmentModal.value = true
  console.log('Opening attachment:', attachment)
}

// Close attachment modal
const closeAttachmentModal = () => {
  showAttachmentModal.value = false
  currentAttachment.value = null
}

// Expose emits for template
const emit = defineEmits(['back', 'send-message', 'open-attachment'])

// Auto-scroll to bottom when new messages arrive
watch(() => props.conversation.messages?.length, async () => {
  await nextTick()
  const scrollbar = document.querySelector('.conversation-scrollbar')
  if (scrollbar) {
    scrollbar.scrollTop = scrollbar.scrollHeight
  }
})

// Scroll to bottom on initial load
onMounted(async () => {
  await nextTick()
  const scrollbar = document.querySelector('.conversation-scrollbar')
  if (scrollbar) {
    scrollbar.scrollTop = scrollbar.scrollHeight
  }
})
</script>
