<template>
  <div class="inline-flex" :title="channelLabel">
    <UIcon 
      :name="channelIcon" 
      class="h-4 w-4"
      :class="channelColorClass"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  channel: {
    type: String,
    required: true,
    validator: (value: string) => ['whatsapp', 'email', 'instagram'].includes(value)
  }
})

// i18n
const { t } = useI18n()

// Computed properties for icon and styling
const channelIcon = computed(() => {
  switch (props.channel) {
    case 'whatsapp':
      return 'i-lucide-message-circle'
    case 'email':
      return 'i-lucide-mail'
    case 'instagram':
      return 'i-lucide-instagram'
    default:
      return 'i-lucide-message-square'
  }
})

const channelColorClass = computed(() => {
  switch (props.channel) {
    case 'whatsapp':
      return 'text-emerald-500 dark:text-emerald-400'
    case 'email':
      return 'text-blue-500 dark:text-blue-400'
    case 'instagram':
      return 'text-pink-500 dark:text-pink-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const channelLabel = computed(() => {
  return t(`inbox.channels.${props.channel}`)
})
</script>
