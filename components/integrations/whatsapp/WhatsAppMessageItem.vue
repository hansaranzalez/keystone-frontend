<template>
  <div 
    class="whatsapp-message-wrapper"
    :class="[
      message.isFromMe ? 'flex justify-end' : 'flex justify-start',
      { 'mt-6': isFirstInGroup }
    ]"
  >
    <!-- Contact Avatar (only for messages from contacts) -->
    <div v-if="!message.isFromMe && isFirstInGroup" class="flex-shrink-0 mr-2">
      <UAvatar
        v-if="contactAvatar"
        :src="contactAvatar"
        :alt="contactName"
        size="sm"
      />
      <UAvatar
        v-else
        :alt="contactName"
        size="sm"
      />
    </div>
    <div v-else-if="!message.isFromMe" class="flex-shrink-0 mr-2 w-8"></div>

    <!-- Message Bubble -->
    <div 
      class="whatsapp-message max-w-[75%] rounded-lg px-3 py-2 mb-1 shadow-sm"
      :class="[
        message.isFromMe 
          ? 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100' 
          : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
      ]"
    >
      <!-- Contact Name (only for first message in group from contact) -->
      <div 
        v-if="!message.isFromMe && isFirstInGroup && contactName" 
        class="text-xs font-medium text-primary-500 dark:text-primary-400 mb-1"
      >
        {{ contactName }}
      </div>

      <!-- Reply Context -->
      <div 
        v-if="message.contextFromMessage" 
        class="reply-context border-l-4 border-slate-300 dark:border-slate-500 pl-2 py-1 mb-2 text-xs bg-slate-100 dark:bg-slate-800 rounded"
      >
        <div class="font-medium">
          {{ message.contextFromMessage.isFromMe ? 'You' : contactName }}
        </div>
        <div class="truncate">{{ message.contextFromMessage.content }}</div>
      </div>

      <!-- Message Content -->
      <div v-if="message.content" class="message-content">
        {{ message.content }}
      </div>

      <!-- Attachments -->
      <div v-if="hasAttachments" class="message-attachments mt-2 space-y-2">
        <template v-for="attachment in message.attachments" :key="attachment.id">
          <!-- Images -->
          <div v-if="attachment.type === 'image'" class="image-attachment">
            <img 
              :src="attachment.url" 
              :alt="attachment.name || 'Image'" 
              class="rounded max-h-64 w-auto cursor-pointer hover:opacity-90 transition"
              @click="openAttachment(attachment)"
            />
            <div v-if="attachment.name" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ attachment.name }}
            </div>
          </div>

          <!-- Videos -->
          <div v-else-if="attachment.type === 'video'" class="video-attachment">
            <div class="relative rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div v-if="attachment.thumbnail" class="w-full">
                <img 
                  :src="attachment.thumbnail" 
                  :alt="attachment.name || 'Video'" 
                  class="w-full h-auto"
                />
              </div>
              <div 
                class="absolute inset-0 flex items-center justify-center cursor-pointer"
                @click="openAttachment(attachment)"
              >
                <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white">
                  <Icon name="heroicons:play-solid" size="md" />
                </div>
              </div>
            </div>
            <div v-if="attachment.name" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ attachment.name }} {{ formatDuration(attachment.duration) }}
            </div>
          </div>

          <!-- Audio -->
          <div v-else-if="attachment.type === 'audio'" class="audio-attachment">
            <div class="bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center">
              <UButton 
                icon="heroicons:play-solid" 
                color="primary" 
                variant="ghost"
                size="xs"
                class="mr-2"
                @click="openAttachment(attachment)"
              />
              <div class="flex-1">
                <div class="h-1 bg-slate-200 dark:bg-slate-600 rounded-full w-full">
                  <div class="h-1 bg-primary-500 rounded-full" style="width: 0%"></div>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {{ formatDuration(attachment.duration) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-else-if="attachment.type === 'document'" class="document-attachment">
            <div 
              class="bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              @click="openAttachment(attachment)"
            >
              <div class="flex-shrink-0 mr-2">
                <Icon name="heroicons:document" size="lg" class="text-primary-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ attachment.name || 'Document' }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  {{ formatFileSize(attachment.size) }} {{ attachment.fileType ? `.${attachment.fileType}` : '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div v-else-if="attachment.type === 'location'" class="location-attachment">
            <div 
              class="bg-slate-100 dark:bg-slate-800 rounded overflow-hidden cursor-pointer hover:opacity-90 transition"
              @click="openLocation(attachment.coordinates)"
            >
              <div class="relative pb-[66%]">
                <div class="absolute inset-0 bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                  <Icon name="heroicons:map" size="xl" class="text-slate-500 dark:text-slate-400" />
                </div>
              </div>
              <div class="p-2 flex items-center">
                <Icon name="heroicons:map-pin" size="sm" class="text-primary-500 mr-1" />
                <div class="text-sm font-medium">Location</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Interactive Content -->
      <div v-if="message.interactiveType" class="interactive-content mt-2">
        <div 
          v-if="message.interactiveType === 'button'" 
          class="flex flex-wrap gap-2 mt-2"
        >
          <UButton
            v-for="(button, index) in message.interactiveData?.buttons || []"
            :key="index"
            size="sm"
            @click="handleInteractiveClick(button)"
          >
            {{ button.text }}
          </UButton>
        </div>
        
        <div v-else-if="message.interactiveType === 'list'" class="mt-2">
          <UButton
            size="sm"
            block
            @click="showListOptions = !showListOptions"
          >
            {{ message.interactiveData?.button || 'Options' }}
          </UButton>
          
          <div v-if="showListOptions" class="mt-1 border rounded divide-y">
            <div
              v-for="(section, secIndex) in message.interactiveData?.sections || []"
              :key="secIndex"
            >
              <div v-if="section.title" class="font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700">
                {{ section.title }}
              </div>
              <div
                v-for="(row, rowIndex) in section.rows || []"
                :key="rowIndex"
                class="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                @click="handleInteractiveClick(row)"
              >
                <div class="font-medium">{{ row.title }}</div>
                <div v-if="row.description" class="text-xs text-slate-500">
                  {{ row.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Timestamp and Status -->
      <div class="flex items-center justify-end gap-1 mt-1">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ formatTime(message.timestamp) }}
        </span>
        <span v-if="message.isFromMe" class="message-status">
          <Icon 
            v-if="message.whatsappStatus === 'read'" 
            name="heroicons:check-circle" 
            size="xs" 
            class="text-green-500"
          />
          <Icon 
            v-else-if="message.whatsappStatus === 'delivered'" 
            name="heroicons:check" 
            size="xs" 
            class="text-blue-500"
          />
          <Icon 
            v-else-if="message.whatsappStatus === 'sent'" 
            name="heroicons:check" 
            size="xs" 
            class="text-slate-500"
          />
          <Icon 
            v-else-if="message.whatsappStatus === 'failed'" 
            name="heroicons:exclamation-circle" 
            size="xs" 
            class="text-red-500"
          />
          <Icon 
            v-else-if="message.whatsappStatus === 'pending'" 
            name="heroicons:clock" 
            size="xs" 
            class="text-yellow-500"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import type { WhatsAppMessage } from '~/models/entities/whatsapp';

// Props
const props = defineProps<{
  message: WhatsAppMessage;
  isFirstInGroup: boolean;
  contactName?: string;
  contactAvatar?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'reply', message: WhatsAppMessage): void;
  (e: 'interactiveClick', data: any): void;
}>();

// State
const showListOptions = ref(false);

// Computed
const hasAttachments = computed(() => {
  return props.message.attachments && props.message.attachments.length > 0;
});

// Methods
function formatTime(date: Date | string) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm');
}

function formatDuration(seconds?: number) {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function openAttachment(attachment: any) {
  // Open attachment in new window or modal
  if (attachment.url) {
    window.open(attachment.url, '_blank');
  }
}

function openLocation(coordinates: any) {
  if (coordinates?.latitude && coordinates?.longitude) {
    const url = `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
    window.open(url, '_blank');
  }
}

function handleInteractiveClick(data: any) {
  emit('interactiveClick', data);
  showListOptions.value = false;
}
</script>

<style scoped>
.whatsapp-message {
  position: relative;
  word-break: break-word;
}
</style>
