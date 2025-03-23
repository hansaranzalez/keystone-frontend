<template>
  <div class="border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 flex-shrink-0">
    <div class="flex items-end gap-2">
      <!-- Channel selector -->
      <UButtonGroup class="mb-0.5">
        <UTooltip :text="$t(`inbox.channels.whatsapp`)">
          <UButton
            color="neutral"
            :variant="activeChannel === 'whatsapp' ? 'solid' : 'ghost'"
            icon="i-lucide-message-circle"
            class="text-emerald-500 dark:text-emerald-400"
            @click="handleChangeChannel('whatsapp')"
          />
        </UTooltip>
        <UTooltip :text="$t(`inbox.channels.email`)">
          <UButton
            color="neutral"
            :variant="activeChannel === 'email' ? 'solid' : 'ghost'"
            icon="i-lucide-mail"
            class="text-blue-500 dark:text-blue-400"
            @click="handleChangeChannel('email')"
          />
        </UTooltip>
        <UTooltip :text="$t(`inbox.channels.instagram`)">
          <UButton
            color="neutral"
            :variant="activeChannel === 'instagram' ? 'solid' : 'ghost'"
            icon="i-lucide-instagram"
            class="text-pink-500 dark:text-pink-400"
            @click="handleChangeChannel('instagram')"
          />
        </UTooltip>
      </UButtonGroup>
      
      <!-- Message input -->
      <UTextarea
        v-model="messageText"
        :placeholder="$t('inbox.typeMessage')"
        variant="outline"
        class="flex-1"
        :rows="1"
        autoresize
        :autosize="{ minRows: 1, maxRows: 5 }"
        @keydown.enter.prevent="handleSubmit"
      />
      
      <!-- Send button -->
      <UButton
        color="primary"
        icon="i-lucide-send"
        :disabled="!canSend"
        :loading="isSending"
        @click="handleSubmit"
      />
    </div>
    
    <!-- Channel indicator text -->
    <div class="mt-1.5 ml-1 text-xs text-slate-500 dark:text-slate-400">
      <span>{{ $t('inbox.sendingVia') }}: </span>
      <span class="font-medium">
        {{ $t(`inbox.channels.${activeChannel}`) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  conversationId: {
    type: String,
    required: true
  },
  activeChannel: {
    type: String,
    default: 'whatsapp',
    validator: (value: string) => ['whatsapp', 'email', 'instagram'].includes(value)
  }
})

// Emits
const emit = defineEmits(['send', 'change-channel'])

// i18n
const { t } = useI18n()

// Local state
const messageText = ref('')
const isSending = ref(false)

// Computed properties
const canSend = computed(() => messageText.value.trim().length > 0)

// Event handlers
const handleSubmit = async () => {
  if (!canSend.value || isSending.value) return
  
  isSending.value = true
  
  try {
    // Emit the send event with the message content
    emit('send', messageText.value)
    
    // Clear the input field after sending
    messageText.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
    // Could show an error toast here
  } finally {
    isSending.value = false
  }
}

const handleChangeChannel = (channel: 'whatsapp' | 'email' | 'instagram') => {
  emit('change-channel', channel)
}
</script>
