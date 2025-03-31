<template>
  <div class="whatsapp-conversation-view flex flex-col h-full">
    <!-- Header -->
    <div class="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0 hidden sm:block">
          <UButton
            v-if="$slots.back || showBackButton"
            icon="heroicons:arrow-left"
            variant="ghost"
            color="neutral"
            size="sm"
            class="mr-2"
            @click="emit('back')"
          />
        </div>
        
        <div class="flex-shrink-0 mr-3">
          <UAvatar
            v-if="conversation?.contact?.avatar"
            :src="conversation?.contact?.avatar"
            :alt="conversation?.contact?.name"
            size="md"
          />
          <UAvatar
            v-else
            :alt="conversation?.contact?.name || 'Contact'"
            size="md"
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline justify-between">
            <h2 class="text-base font-semibold truncate">
              {{ conversation?.contact?.name || conversation?.profileName || 'Unknown Contact' }}
            </h2>
            <UBadge
              v-if="conversation?.whatsappAccountId && accountName"
              color="primary"
              variant="subtle"
              size="xs"
              class="hidden sm:inline-flex ml-2"
            >
              {{ accountName }}
            </UBadge>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 flex gap-2 items-center">
            <span v-if="conversation?.contact?.phone">{{ conversation?.contact?.phone }}</span>
            <span v-if="conversation?.isBusiness" class="flex items-center text-green-600 dark:text-green-400">
              <Icon name="heroicons:building-storefront-mini" size="xs" class="mr-1" />
              {{ $t('whatsapp.business') }}
            </span>
          </div>
        </div>
        
        <div class="flex-shrink-0 flex gap-1">
          <UButton
            v-if="!mobileViewOpen"
            icon="heroicons:arrow-left"
            variant="ghost"
            size="sm"
            class="sm:hidden"
            @click="emit('back')"
          />
          <UDropdown :items="menuItems">
            <UButton
              icon="heroicons:ellipsis-vertical"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UDropdown>
        </div>
      </div>
    </div>
    
    <!-- Messages Area -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-1"
    >
      <div v-if="loading" class="flex justify-center py-4">
        <UIcon 
          name="heroicons:arrow-path" 
          class="animate-spin text-primary-500 h-8 w-8"
        />
      </div>
      
      <div v-else-if="!hasMessages" class="flex flex-col items-center justify-center h-full py-12">
        <Icon 
          name="heroicons:chat-bubble-left-right" 
          size="xl" 
          class="text-slate-300 dark:text-slate-600 mb-4"
        />
        <p class="text-slate-500 dark:text-slate-400 text-center">
          {{ $t('whatsapp.conversation.noMessages') }}
        </p>
        <p v-if="!conversation" class="text-slate-400 dark:text-slate-500 text-sm text-center mt-2">
          {{ $t('whatsapp.conversation.selectOrStart') }}
        </p>
      </div>
      
      <template v-else>
        <div v-for="(group, groupIndex) in messageGroups" :key="groupIndex" class="mb-4">
          <!-- Date separator -->
          <div v-if="group.showDate" class="flex justify-center my-4">
            <div class="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-300">
              {{ formatMessageDate(group.date) }}
            </div>
          </div>
          
          <!-- Messages -->
          <WhatsAppMessageItem
            v-for="(message, msgIndex) in group.messages"
            :key="message.id"
            :message="message"
            :is-first-in-group="msgIndex === 0 || message.isFromMe !== group.messages[msgIndex - 1].isFromMe"
            :contact-name="conversation?.contact?.name || conversation?.profileName"
            :contact-avatar="conversation?.contact?.avatar"
            @reply="handleReply"
            @interactive-click="handleInteractiveClick"
          />
        </div>
        
        <!-- Scroll to bottom button -->
        <UButton
          v-if="showScrollButton"
          icon="heroicons:arrow-down"
          size="sm"
          color="primary"
          class="fixed bottom-24 right-4 shadow-lg rounded-full"
          @click="scrollToBottom"
        />
      </template>
    </div>
    
    <!-- Composer -->
    <div class="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <form @submit.prevent="sendMessage">
        <!-- Reply preview -->
        <div 
          v-if="replyToMessage" 
          class="flex items-center mb-2 bg-slate-100 dark:bg-slate-700 rounded px-3 py-2"
        >
          <div class="flex-1 min-w-0">
            <div class="text-xs text-primary-500 font-medium">
              {{ replyToMessage.isFromMe ? 'You' : (conversation?.contact?.name || conversation?.profileName) }}
            </div>
            <div class="text-sm truncate">{{ replyToMessage.content }}</div>
          </div>
          <UButton
            icon="heroicons:x-mark"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="replyToMessage = null"
          />
        </div>
        
        <!-- Attachment preview -->
        <div v-if="attachments.length > 0" class="mb-2">
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(attachment, index) in attachments" 
              :key="index"
              class="relative border rounded p-2 bg-slate-50 dark:bg-slate-700"
            >
              <UButton
                icon="heroicons:x-mark"
                size="xs"
                class="absolute -top-2 -right-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                @click="removeAttachment(index)"
              />
              
              <div v-if="attachment.type === 'image' && attachment.preview" class="h-16 w-16">
                <img :src="attachment.preview" alt="Image" class="h-full w-full object-cover rounded" />
              </div>
              
              <div v-else-if="attachment.type === 'document'" class="flex items-center">
                <Icon name="heroicons:document" size="md" class="text-primary-500 mr-2" />
                <span class="text-xs truncate max-w-[150px]">{{ attachment.file.name }}</span>
              </div>
              
              <div v-else class="flex items-center">
                <Icon name="heroicons:paper-clip" size="md" class="text-primary-500 mr-2" />
                <span class="text-xs">{{ attachment.type }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input area -->
        <div class="flex items-end gap-1">
          <UDropdown
            :items="attachmentMenuItems"
            placement="top-start"
          >
            <UButton
              icon="heroicons:paper-clip"
              color="neutral"
              variant="ghost"
              class="rounded-full"
            />
          </UDropdown>
          
          <div class="flex-1 min-w-0">
            <UTextarea
              v-model="messageText"
              :placeholder="$t('whatsapp.conversation.typeMessage')"
              :autogrow="true"
              class="resize-none max-h-[150px]"
              :rows="1"
              @keydown.enter.prevent="handleEnterPress"
              @focus="isInputFocused = true"
              @blur="isInputFocused = false"
            />
          </div>
          
          <div>
            <UButton
              v-if="messageText.trim() || attachments.length > 0"
              icon="heroicons:paper-airplane"
              color="primary"
              type="submit"
              class="rounded-full"
              :loading="sending"
              :disabled="sending"
            />
            <UDropdown
              v-else
              :items="quickActionsMenuItems"
              placement="top-end"
            >
              <UButton
                icon="heroicons:plus"
                color="primary"
                class="rounded-full"
              />
            </UDropdown>
          </div>
        </div>
        
        <!-- Hidden file inputs -->
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageSelected"
        >
        <input
          ref="documentInput"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          class="hidden"
          @change="handleDocumentSelected"
        >
        <input
          ref="audioInput"
          type="file"
          accept="audio/*"
          class="hidden"
          @change="handleAudioSelected"
        >
        <input
          ref="videoInput"
          type="file"
          accept="video/*"
          class="hidden"
          @change="handleVideoSelected"
        >
      </form>
    </div>
    
    <!-- Template Selector Modal -->
    <UModal v-model="showTemplateModal">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">{{ $t('whatsapp.templates.select') }}</h3>
        
        <div v-if="loadingTemplates" class="flex justify-center py-8">
          <UIcon 
            name="heroicons:arrow-path" 
            class="animate-spin text-primary-500 h-8 w-8"
          />
        </div>
        
        <div v-else-if="!availableTemplates.length" class="text-center py-8">
          <p class="text-slate-500">{{ $t('whatsapp.templates.none') }}</p>
        </div>
        
        <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
          <div 
            v-for="template in availableTemplates"
            :key="template.id"
            class="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            @click="selectTemplate(template)"
          >
            <div class="flex justify-between items-start">
              <h4 class="font-medium">{{ template.name }}</h4>
              <UBadge 
                :color="(template && template.status === 'APPROVED') ? 'success' : ((template && template.status === 'PENDING') ? 'warning' : 'error')"
                size="xs"
              >
                {{ template.status }}
              </UBadge>
            </div>
            
            <div class="text-xs text-slate-500 mt-1">{{ template.language }}</div>
            
            <div class="mt-2 space-y-2">
              <div 
                v-for="(component, index) in template.components"
                :key="index"
                class="text-sm"
              >
                <div v-if="component.text" class="whitespace-pre-line">{{ component.text }}</div>
                <div 
                  v-if="component.parameters && component.parameters.length"
                  class="mt-1 pl-3 border-l-2 border-primary-200 dark:border-primary-700 italic text-xs text-slate-500"
                >
                  <div v-for="(param, pIndex) in component.parameters" :key="pIndex">
                    {{ param.placeholder }} {{ param.example ? `(e.g. ${param.example})` : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
          <UButton
            color="neutral"
            variant="outline"
            @click="showTemplateModal = false"
          >
            {{ $t('cancel') }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWhatsAppConversationStore } from '~/store/whatsapp-conversation.store';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import type {
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppTemplate
} from '~/models/entities/whatsapp';
import { WhatsAppMessageType, WhatsAppMessageStatus } from '~/models/entities/whatsapp';

// Props and emits
const props = defineProps<{
  conversationId?: string;
  accountId?: string;
  showBackButton?: boolean;
  mobileViewOpen?: boolean;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'messageSent', message: WhatsAppMessage): void;
}>();

// i18n
const { t, locale } = useI18n();

// Stores
const conversationStore = useWhatsAppConversationStore();
const whatsAppStore = useWhatsAppStore();

// Refs
const messagesContainer = ref<HTMLElement | null>(null);
const messageText = ref('');
const replyToMessage = ref<WhatsAppMessage | null>(null);
const attachments = ref<Array<{
  type: string;
  file: File;
  preview?: string;
}>>([]);
const imageInput = ref<HTMLInputElement | null>(null);
const documentInput = ref<HTMLInputElement | null>(null);
const audioInput = ref<HTMLInputElement | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);
const showScrollButton = ref(false);
const isInputFocused = ref(false);
const showTemplateModal = ref(false);

// Computed
const conversation = computed(() => {
  return conversationStore.activeConversation as WhatsAppConversation | null;
});

const messages = computed(() => {
  return conversation.value?.messages || [];
});

const hasMessages = computed(() => {
  return messages.value.length > 0;
});

const loading = computed(() => {
  return conversationStore.loading.conversation;
});

const sending = computed(() => {
  return conversationStore.loading.sendingMessage;
});

const loadingTemplates = computed(() => {
  return conversationStore.loading.templates;
});

const availableTemplates = computed(() => {
  return conversationStore.availableTemplates;
});

const accountName = computed(() => {
  if (!conversation.value?.whatsappAccountId) return '';
  const account = whatsAppStore.getAccountById(conversation.value.whatsappAccountId);
  return account?.name || '';
});

// Group messages by date and sender
const messageGroups = computed(() => {
  if (!messages.value.length) return [];
  
  const groups: Array<{
    date: Date;
    showDate: boolean;
    messages: WhatsAppMessage[];
  }> = [];
  
  let currentDate: Date = new Date();
  let currentGroup: WhatsAppMessage[] = [];
  
  messages.value.forEach((message, index) => {
    const messageDate = new Date(message.timestamp);
    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );
    
    // Check if we need a new date group
    if (!currentDate || !isSameDay(messageDay, currentDate)) {
      // Save the current group if it exists
      if (currentGroup.length > 0) {
        groups.push({
          date: currentDate,
          showDate: true,
          messages: [...currentGroup]
        });
        currentGroup = [];
      }
      
      currentDate = messageDay;
      
      // Check if we should show the date header
      // Always show for the first group
      const showDate = index === 0 || 
        !isSameDay(messageDay, new Date(messages.value[index - 1].timestamp));
        
      if (showDate) {
        groups.push({
          date: messageDay,
          showDate,
          messages: []
        });
      }
    }
    
    // Cast to WhatsAppMessage type to ensure type compatibility
    currentGroup.push(message as WhatsAppMessage);
    
    // If this is the last message, save the current group
    if (index === messages.value.length - 1) {
      groups.push({
        date: currentDate,
        showDate: false,
        messages: [...currentGroup]
      });
    }
  });
  
  return groups.filter(g => g.messages.length > 0);
});

// Dropdown menus
const menuItems = computed(() => {
  return [
    {
      label: t('whatsapp.conversation.viewContact'),
      icon: 'heroicons:user',
      click: () => {
        // TODO: Navigate to contact view
      }
    },
    {
      label: t('whatsapp.conversation.refreshConversation'),
      icon: 'heroicons:arrow-path',
      click: loadConversation
    },
    [
      {
        label: conversation.value?.isArchived ? 
          t('whatsapp.conversation.unarchive') : 
          t('whatsapp.conversation.archive'),
        icon: conversation.value?.isArchived ?
          'heroicons:archive-box-arrow-up' :
          'heroicons:archive-box',
        click: toggleArchiveConversation
      },
      {
        label: conversation.value?.isBlocked ?
          t('whatsapp.conversation.unblock') :
          t('whatsapp.conversation.block'),
        icon: conversation.value?.isBlocked ?
          'heroicons:lock-open' :
          'heroicons:lock-closed',
        click: toggleBlockConversation,
        color: conversation.value?.isBlocked ? undefined : 'red'
      }
    ]
  ];
});

const attachmentMenuItems = computed(() => {
  return [
    {
      label: t('whatsapp.attachment.image'),
      icon: 'heroicons:photo',
      click: () => imageInput.value?.click()
    },
    {
      label: t('whatsapp.attachment.document'),
      icon: 'heroicons:document',
      click: () => documentInput.value?.click()
    },
    {
      label: t('whatsapp.attachment.audio'),
      icon: 'heroicons:speaker-wave',
      click: () => audioInput.value?.click()
    },
    {
      label: t('whatsapp.attachment.video'),
      icon: 'heroicons:film',
      click: () => videoInput.value?.click()
    }
  ];
});

const quickActionsMenuItems = computed(() => {
  return [
    {
      label: t('whatsapp.quickActions.template'),
      icon: 'heroicons:template',
      click: () => showTemplateModal.value = true
    },
    {
      label: t('whatsapp.quickActions.location'),
      icon: 'heroicons:map-pin',
      click: handleSendLocation
    }
  ];
});

// Methods
function formatMessageDate(date: Date) {
  if (isToday(date)) {
    return t('whatsapp.date.today');
  } else if (isYesterday(date)) {
    return t('whatsapp.date.yesterday');
  } else {
    return format(date, 'PPP', {
      locale: locale.value === 'es' ? es : undefined
    });
  }
}

async function loadConversation() {
  if (props.conversationId) {
    await conversationStore.loadConversation(props.conversationId, props.accountId);
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

function handleScroll() {
  if (!messagesContainer.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  showScrollButton.value = scrollHeight - scrollTop - clientHeight > 100;
}

function handleEnterPress(e: KeyboardEvent) {
  // Send on Enter, but allow Shift+Enter for newline
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function handleReply(message: any) {
  // Ensure the message conforms to WhatsAppMessage interface
  if (message && typeof message === 'object') {
    replyToMessage.value = message as WhatsAppMessage;
  }
}

async function handleInteractiveClick(data: any) {
  // When a user clicks an interactive button/list item
  if (data && conversation.value) {
    if (data.text) {
      messageText.value = data.text;
    } else if (data.id) {
      // For list selections or button payloads
      await conversationStore.sendTextMessage(
        conversation.value.id,
        data.id
      );
    }
  }
}

async function sendMessage() {
  if ((!messageText.value.trim() && attachments.value.length === 0) || !conversation.value) {
    return;
  }
  
  try {
    let success = false;
    
    // Handle attachments first
    if (attachments.value.length > 0) {
      for (const attachment of attachments.value) {
        const media = {
          type: attachment.type as any,
          fileData: attachment.file,
          caption: attachment.type === 'image' ? messageText.value : undefined,
          filename: attachment.file.name
        };
        
        success = await conversationStore.sendMediaMessage(
          conversation.value.id,
          media
        );
        
        if (!success) break;
      }
      
      // Reset message text if it was used as a caption
      if (success && attachments.value.some(a => a.type === 'image')) {
        messageText.value = '';
      }
    }
    
    // Send text message if there's content or if no attachments were sent
    if (messageText.value.trim() && (!attachments.value.length || !success)) {
      success = await conversationStore.sendTextMessage(
        conversation.value.id,
        messageText.value
      );
    }
    
    if (success) {
      // Reset everything
      messageText.value = '';
      replyToMessage.value = null;
      attachments.value = [];
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

function handleImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      attachments.value.push({
        type: 'image',
        file,
        preview: e.target?.result as string
      });
    };
    
    reader.readAsDataURL(file);
  }
  
  // Reset the input
  if (imageInput.value) {
    imageInput.value.value = '';
  }
}

function handleDocumentSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    attachments.value.push({
      type: 'document',
      file: input.files[0]
    });
  }
  
  // Reset the input
  if (documentInput.value) {
    documentInput.value.value = '';
  }
}

function handleAudioSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    attachments.value.push({
      type: 'audio',
      file: input.files[0]
    });
  }
  
  // Reset the input
  if (audioInput.value) {
    audioInput.value.value = '';
  }
}

function handleVideoSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    attachments.value.push({
      type: 'video',
      file: input.files[0]
    });
  }
  
  // Reset the input
  if (videoInput.value) {
    videoInput.value.value = '';
  }
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1);
}

function handleSendLocation() {
  // This would typically open a location picker
  // For now, just prompt for coordinates
  const lat = prompt(t('whatsapp.location.latitude'), '0');
  const lng = prompt(t('whatsapp.location.longitude'), '0');
  
  if (lat && lng && conversation.value) {
    const location = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng)
    };
    
    // TODO: Implement location sending through WhatsApp API
    console.log('Sending location:', location);
  }
}

function toggleArchiveConversation() {
  // TODO: Implement archive/unarchive functionality
  console.log('Toggle archive conversation:', conversation.value?.id);
}

function toggleBlockConversation() {
  // TODO: Implement block/unblock functionality
  console.log('Toggle block conversation:', conversation.value?.id);
}

function selectTemplate(template: any) {
  // Cast to WhatsAppTemplate with proper structure
  const whatsappTemplate: WhatsAppTemplate = {
    id: template.id,
    name: template.name,
    language: template.language || 'en_US',
    category: template.category || 'UTILITY',
    status: template.status || 'PENDING',
    components: template.components.map((comp: any) => ({
      type: comp.type,
      text: comp.text,
      format: comp.format,
      parameters: comp.parameters?.map((param: any) => ({
        type: param.type as 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video',
        placeholder: param.placeholder || '',
        example: param.example
      })) || []
    }))
  };
  
  console.log('Selected template:', whatsappTemplate);
  // Prepare message with the template as a proper WhatsAppMessage
  const templateMessage: WhatsAppMessage = {
    id: `template-${Date.now()}`,
    whatsappAccountId: whatsAppStore.activeAccount?.id || '',
    whatsappStatus: WhatsAppMessageStatus.SENT,
    whatsappMessageId: `template-${Date.now()}`,
    whatsappMessageType: WhatsAppMessageType.TEMPLATE,
    isFromMe: true,
    content: `[Template: ${whatsappTemplate.name}]`,
    timestamp: new Date(),
    status: 'sent',
    attachments: [],
    templateName: whatsappTemplate.name,
    templateLanguage: whatsappTemplate.language,
    templateParams: {}, // Empty template params
    senderId: whatsAppStore.activeAccount?.id || '',
    channel: 'whatsapp'
  };
  
  emit('messageSent', templateMessage);
  showTemplateModal.value = false;
}

// Lifecycle hooks
onMounted(async () => {
  if (props.conversationId) {
    await loadConversation();
  }
  
  if (props.accountId) {
    conversationStore.setActiveAccount(props.accountId);
  }
  
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll);
    scrollToBottom();
  }
});

// Watchers
watch(() => props.conversationId, async (newId) => {
  if (newId) {
    await loadConversation();
  }
});

watch(() => props.accountId, (newId) => {
  if (newId) {
    conversationStore.setActiveAccount(newId);
  }
});

watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });
</script>

<style scoped>
.whatsapp-conversation-view {
  height: 100%;
  min-height: 0;
}
</style>
