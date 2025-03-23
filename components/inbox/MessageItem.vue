<template>
  <div 
    class="flex"
    :class="isOutgoing ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[75%] rounded-lg px-4 py-2 shadow-sm"
      :class="[
        isOutgoing 
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 rounded-tr-none' 
          : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-none'
      ]"
    >
      <div class="flex items-center justify-between gap-4 mb-1">
        <!-- Channel indicator + sender name for incoming -->
        <div class="flex items-center">
          <ChannelIndicator 
            v-if="!isOutgoing" 
            :channel="message.channel" 
            class="mr-1.5" 
          />
          <span class="text-xs font-medium" :class="isOutgoing ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'">
            {{ senderName }}
          </span>
        </div>
        
        <!-- Time -->
        <span class="text-xs opacity-70 whitespace-nowrap">
          {{ formatTime(message.timestamp) }}
        </span>
      </div>
      
      <!-- Message content -->
      <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
      
      <!-- Attachments -->
      <div v-if="message.attachments && message.attachments.length > 0" class="mt-3 space-y-2">
        <!-- Images -->
        <div v-if="hasAttachmentType('image')" class="grid grid-cols-2 gap-2">
          <div 
            v-for="attachment in getAttachmentsByType('image')" 
            :key="attachment.id"
            class="relative rounded-lg overflow-hidden cursor-pointer"
            @click="openAttachment(attachment)"
          >
            <img 
              :src="attachment.url" 
              :alt="attachment.name || 'Imagen'" 
              class="w-full h-32 object-cover"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-xs p-1 truncate">
              {{ attachment.name }}
            </div>
          </div>
        </div>
        
        <!-- Videos -->
        <div v-if="hasAttachmentType('video')" class="space-y-2">
          <div 
            v-for="attachment in getAttachmentsByType('video')" 
            :key="attachment.id"
            class="relative rounded-lg overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
            @click="openAttachment(attachment)"
          >
            <div class="flex items-center p-3">
              <div class="relative w-24 h-16 flex-shrink-0 rounded mr-3 overflow-hidden">
                <img 
                  v-if="attachment.thumbnail" 
                  :src="attachment.thumbnail" 
                  class="w-full h-full object-cover" 
                />
                <div v-else class="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <UIcon name="i-lucide-video" class="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <UIcon name="i-lucide-play" class="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ attachment.name || $t('inbox.video', 'Video') }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                  <span>{{ formatFileSize(attachment.size) }}</span>
                  <span v-if="attachment.duration" class="ml-2">{{ formatDuration(attachment.duration) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Audio -->
        <div v-if="hasAttachmentType('audio')" class="space-y-2">
          <div 
            v-for="attachment in getAttachmentsByType('audio')" 
            :key="attachment.id"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 cursor-pointer"
            @click="openAttachment(attachment)"
          >
            <div class="flex items-center">
              <UIcon name="i-lucide-headphones" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ attachment.name || $t('inbox.audioMessage', 'Mensaje de voz') }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                  <span>{{ formatDuration(attachment.duration) }}</span>
                  <span class="ml-2">{{ formatFileSize(attachment.size) }}</span>
                </div>
              </div>
              <UIcon name="i-lucide-play" class="h-6 w-6 text-slate-500 dark:text-slate-400 ml-2" />
            </div>
          </div>
        </div>
        
        <!-- Documents -->
        <div v-if="hasAttachmentType('document')" class="space-y-2">
          <div 
            v-for="attachment in getAttachmentsByType('document')" 
            :key="attachment.id"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 cursor-pointer"
            @click="openAttachment(attachment)"
          >
            <div class="flex items-center">
              <UIcon name="i-lucide-file-text" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ attachment.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ formatFileSize(attachment.size) }}</div>
                <div v-if="attachment.previewText" class="text-xs mt-1 truncate">{{ attachment.previewText }}</div>
              </div>
              <UIcon name="i-lucide-download" class="h-5 w-5 text-slate-500 dark:text-slate-400 ml-2" />
            </div>
          </div>
        </div>
        
        <!-- Location -->
        <div v-if="hasAttachmentType('location')" class="space-y-2">
          <div 
            v-for="attachment in getAttachmentsByType('location')" 
            :key="attachment.id"
            class="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 cursor-pointer"
            @click="openAttachment(attachment)"
          >
            <div class="flex items-center">
              <UIcon name="i-lucide-map-pin" class="h-10 w-10 text-slate-500 dark:text-slate-400 mr-3" />
              <div class="flex-1">
                <div class="font-medium">{{ attachment.name || $t('inbox.location', 'Ubicación') }}</div>
                <div class="text-xs text-primary-600 dark:text-primary-400 mt-1">{{ $t('inbox.viewLocation', 'Ver ubicación') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status indicators (for outgoing messages) -->
      <div v-if="isOutgoing" class="flex justify-end mt-1">
        <UIcon
          :name="statusIcon"
          class="h-3.5 w-3.5"
          :class="statusIconColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Simple date formatter to avoid date-fns TypeScript issues
const formatTime = (timestamp: Date): string => {
  const hours = timestamp.getHours().toString().padStart(2, '0')
  const minutes = timestamp.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
import ChannelIndicator from './ChannelIndicator.vue'
import type { Message, Contact, Attachment } from '~/services/inbox.service'

// Props
const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true
  },
  contact: {
    type: Object as () => Contact,
    required: true
  }
})

// Emits
const emit = defineEmits(['open-attachment'])

// i18n
const { t } = useI18n()

// Check if message is outgoing (sent by the agent/user)
const isOutgoing = computed(() => props.message.senderId === 'agent')

// Determine the sender name
const senderName = computed(() => {
  if (isOutgoing.value) {
    return t('inbox.you', 'Tú')
  } else {
    return props.contact.name
  }
})

// Message status indicators
const statusIcon = computed(() => {
  if (!props.message.status || props.message.status === 'sent') {
    return 'i-lucide-check'
  } else if (props.message.status === 'delivered') {
    return 'i-lucide-check-check'
  } else if (props.message.status === 'read') {
    return 'i-lucide-check-check'
  } else {
    return 'i-lucide-alert-circle'
  }
})

const statusIconColor = computed(() => {
  if (props.message.status === 'read') {
    return 'text-primary-500 dark:text-primary-400'
  } else if (props.message.status === 'failed') {
    return 'text-red-500 dark:text-red-400'
  } else {
    return 'text-gray-400 dark:text-gray-500'
  }
})

// Attachment helper functions
const hasAttachmentType = (type: string): boolean => {
  return props.message.attachments?.some(a => a.type === type) || false
}

const getAttachmentsByType = (type: string): Attachment[] => {
  return props.message.attachments?.filter(a => a.type === type) || []
}

const openAttachment = (attachment: Attachment): void => {
  emit('open-attachment', attachment)
  // In a real app, this would open a viewer for the attachment
  console.log('Opening attachment:', attachment)
}

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

// Note: formatTime function moved to the top of the file

// Helper methods already defined above
</script>
