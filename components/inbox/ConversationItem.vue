<template>
  <div 
    class="px-4 py-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
    :class="{ 'bg-slate-100 dark:bg-slate-800': selected }"
    @click="$emit('click')"
  >
    <div class="flex items-center">
      <!-- Avatar or Initials -->
      <UAvatar
        :alt="conversation.contact.name"
        :src="conversation.contact.avatar"
        size="md"
        class="mr-3 flex-shrink-0"
      />
      
      <!-- Contact info and message preview -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <!-- Contact name -->
          <h3 class="font-medium truncate" :class="conversation.lastMessage.isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'">
            {{ conversation.contact.name }}
          </h3>
          
          <!-- Time and channel indicator -->
          <div class="flex items-center ml-2">
            <!-- Time -->
            <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ formatTime(conversation.lastMessage.timestamp) }}
            </span>
            
            <!-- Unread indicator -->
            <div v-if="conversation.lastMessage.isUnread" class="h-2.5 w-2.5 rounded-full bg-primary-500 ml-2"></div>
          </div>
        </div>
        
        <!-- Message preview and channel -->
        <div class="flex items-center mt-1">
          <!-- Channel icon -->
          <ChannelIndicator :channel="conversation.lastMessage.channel" class="mr-2 flex-shrink-0" />
          
          <!-- Preview text -->
          <p class="text-sm truncate" :class="conversation.lastMessage.isUnread ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">
            {{ conversation.lastMessage.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'
import { useI18n } from 'vue-i18n'
import ChannelIndicator from './ChannelIndicator.vue'

// Props
const props = defineProps({
  conversation: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

// i18n
const { t } = useI18n()

// Format message timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return format(date, 'HH:mm')
  } else if (isYesterday(date)) {
    return t('inbox.yesterday')
  } else if (isThisWeek(date)) {
    return format(date, 'EEE') // Day of week
  } else if (isThisYear(date)) {
    return format(date, 'dd MMM') // e.g. 15 Mar
  } else {
    return format(date, 'dd/MM/yyyy')
  }
}
</script>
