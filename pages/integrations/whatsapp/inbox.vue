<template>
  <div class="whatsapp-inbox-page h-full flex flex-col">
    <UContainer class="flex-1 flex flex-col min-h-0 p-0 sm:p-4 md:p-6">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col h-full border border-slate-200 dark:border-slate-700">
        <!-- Page Header -->
        <div class="border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-800">
          <div class="flex items-center space-x-3">
            <h1 class="text-xl font-semibold text-slate-900 dark:text-white">
              {{ $t('whatsapp.inbox.title') }}
            </h1>
            
            <UBadge v-if="totalUnreadCount > 0" color="primary" size="sm">
              {{ totalUnreadCount }}
            </UBadge>
          </div>
          
          <div class="flex items-center gap-2">
            <USelect
              v-if="availableAccounts.length > 1"
              v-model="selectedAccountId"
              :options="availableAccounts"
              option-attribute="name"
              value-attribute="id"
              placeholder="Select account"
              size="sm"
              class="w-48"
            />
            
            <UButton
              icon="heroicons:arrow-path"
              color="neutral"
              variant="ghost"
              :loading="loading.conversations"
              :disabled="loading.conversations"
              @click="refreshConversations"
            />
          </div>
        </div>
        
        <!-- Inbox Content -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Conversation List (hidden on mobile when a conversation is open) -->
          <div 
            class="conversation-list w-full md:w-96 border-r border-slate-200 dark:border-slate-700 flex flex-col"
            :class="{ 'hidden md:flex': isMobileView && activeConversation }"
          >
            <!-- Search & Filters -->
            <div class="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <UInputGroup>
                <UInput
                  v-model="searchQuery"
                  :placeholder="$t('whatsapp.inbox.searchPlaceholder')"
                  icon="heroicons:magnifying-glass"
                  size="sm"
                  class="w-full"
                />
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="heroicons:adjustments-horizontal"
                  @click="showFilters = !showFilters"
                />
              </UInputGroup>
              
              <div v-if="showFilters" class="mt-3 flex flex-wrap gap-2">
                <UButton
                  size="xs"
                  :color="unreadFilter ? 'primary' : 'neutral'"
                  :variant="unreadFilter ? 'solid' : 'soft'"
                  @click="toggleUnreadFilter"
                >
                  <template #leading>
                    <UIcon
                      :name="unreadFilter ? 'heroicons:envelope' : 'heroicons:envelope-open'"
                      class="h-4 w-4"
                    />
                  </template>
                  {{ $t('whatsapp.inbox.unreadOnly') }}
                </UButton>
              </div>
            </div>
            
            <!-- Conversation List -->
            <div class="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
              <div v-if="loading.conversations" class="flex justify-center py-8">
                <UIcon 
                  name="heroicons:arrow-path" 
                  class="animate-spin text-primary-500 h-8 w-8"
                />
              </div>
              
              <div 
                v-else-if="filteredConversations.length === 0" 
                class="flex flex-col items-center justify-center text-center py-12 px-4"
              >
                <Icon 
                  name="heroicons:chat-bubble-left-right" 
                  size="xl" 
                  class="text-slate-300 dark:text-slate-600 mb-4"
                />
                
                <p class="text-slate-500 dark:text-slate-400">
                  {{ searchQuery ? $t('whatsapp.inbox.noSearchResults') : $t('whatsapp.inbox.noConversations') }}
                </p>
                
                <UButton
                  v-if="searchQuery"
                  color="primary"
                  variant="ghost"
                  size="sm"
                  class="mt-4"
                  @click="searchQuery = ''"
                >
                  {{ $t('whatsapp.inbox.clearSearch') }}
                </UButton>
              </div>
              
              <ul v-else class="divide-y divide-slate-200 dark:divide-slate-700">
                <li 
                  v-for="conversation in filteredConversations" 
                  :key="conversation.id"
                  class="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  :class="{ 
                    'bg-slate-100 dark:bg-slate-800': activeConversationId === conversation.id,
                    'border-l-4 border-primary-500': conversation.lastMessage.isUnread
                  }"
                  @click="selectConversation(conversation.id)"
                >
                  <div class="p-3 flex items-start">
                    <!-- Avatar with status -->
                    <div class="flex-shrink-0 relative mr-3">
                      <UAvatar
                        v-if="conversation.contact?.avatar || conversation.profilePicture"
                        :src="conversation.contact?.avatar || conversation.profilePicture"
                        :alt="conversation.contact?.name || conversation.profileName || ''"
                        size="md"
                      />
                      <UAvatar
                        v-else
                        :alt="conversation.contact?.name || conversation.profileName || ''"
                        size="md"
                      />
                      
                      <UBadge
                        v-if="conversation.unreadCount > 0"
                        color="primary"
                        size="xs"
                        class="absolute -top-1 -right-1"
                      >
                        {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                      </UBadge>
                    </div>
                    
                    <!-- Contact info and message preview -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between">
                        <h3 class="font-medium text-slate-900 dark:text-white truncate">
                          {{ conversation.contact?.name || conversation.profileName || conversation.contact?.phone || $t('whatsapp.inbox.unknown') }}
                        </h3>
                        <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                          {{ formatTime(conversation.lastMessage.timestamp) }}
                        </span>
                      </div>
                      
                      <div class="flex items-center mt-1">
                        <div class="flex-1 text-sm text-slate-500 dark:text-slate-400 truncate">
                          <span v-if="conversation.lastMessageType === 'image'" class="mr-1">
                            <Icon name="heroicons:photo" size="xs" class="inline-block" />
                          </span>
                          <span v-else-if="conversation.lastMessageType === 'document'" class="mr-1">
                            <Icon name="heroicons:document" size="xs" class="inline-block" />
                          </span>
                          <span v-else-if="conversation.lastMessageType === 'location'" class="mr-1">
                            <Icon name="heroicons:map-pin" size="xs" class="inline-block" />
                          </span>
                          {{ conversation.lastMessage.content }}
                        </div>
                        
                        <div class="flex-shrink-0 ml-2">
                          <UBadge
                            v-if="conversation.isBusiness"
                            color="success"
                            variant="subtle"
                            size="xs"
                          >
                            {{ $t('whatsapp.business') }}
                          </UBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Conversation View (full width on mobile, right side on desktop) -->
          <div 
            class="conversation-view w-full flex flex-col"
            :class="{ 'hidden md:flex': isMobileView && !activeConversation }"
          >
            <div v-if="!activeConversation" class="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
              <Icon 
                name="heroicons:chat-bubble-left-right" 
                size="2xl" 
                class="text-slate-300 dark:text-slate-600 mb-4"
              />
              <h3 class="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ $t('whatsapp.inbox.selectConversation') }}
              </h3>
              <p class="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                {{ $t('whatsapp.inbox.selectConversationHint') }}
              </p>
            </div>
            
            <WhatsAppConversationView
              v-else
              :conversation-id="activeConversationId"
              :account-id="selectedAccountId"
              :show-back-button="true"
              :mobile-view-open="isMobileView && activeConversation"
              @back="clearActiveConversation"
              @message-sent="handleMessageSent"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { useWhatsAppConversationStore } from '~/store/whatsapp-conversation.store';
import { useWhatsAppStore } from '~/store/whatsapp.store';
import type { WhatsAppMessage } from '~/models/entities/whatsapp';

const { t } = useI18n();

// Stores
const conversationStore = useWhatsAppConversationStore();
const whatsAppStore = useWhatsAppStore();

// Reactive state
const searchQuery = ref('');
const showFilters = ref(false);
const selectedAccountId = ref('');
const isMobileView = ref(false);

// Computed
const loading = computed(() => {
  return conversationStore.loading;
});

const filteredConversations = computed(() => {
  return conversationStore.filteredConversations;
});

const activeConversation = computed(() => {
  return conversationStore.activeConversation;
});

const activeConversationId = computed(() => {
  return conversationStore.activeConversationId;
});

const unreadFilter = computed(() => {
  return conversationStore.unreadFilter;
});

const totalUnreadCount = computed(() => {
  return conversationStore.totalUnreadCount;
});

const availableAccounts = computed(() => {
  return whatsAppStore.activeAccounts;
});

// Methods
function formatTime(date: Date | string) {
  if (!date) return '';
  const today = new Date();
  const messageDate = new Date(date);
  
  if (messageDate.toDateString() === today.toDateString()) {
    return format(messageDate, 'HH:mm');
  } else {
    return format(messageDate, 'dd/MM/yyyy');
  }
}

async function refreshConversations() {
  await conversationStore.loadConversations(selectedAccountId.value);
}

function selectConversation(id: string) {
  conversationStore.loadConversation(id, selectedAccountId.value);
}

function clearActiveConversation() {
  conversationStore.clearActiveConversation();
}

function toggleUnreadFilter() {
  conversationStore.toggleUnreadFilter();
}

function handleMessageSent(message: WhatsAppMessage) {
  // Any additional handling when a message is sent
  console.log('Message sent:', message);
}

function handleResize() {
  isMobileView.value = window.innerWidth < 768;
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  conversationStore.setSearchQuery(newQuery);
});

// Watch for selected account changes
watch(selectedAccountId, async (newId) => {
  if (newId) {
    conversationStore.setActiveAccount(newId);
  }
});

// Lifecycle hooks
onMounted(async () => {
  // Set up resize event
  handleResize();
  window.addEventListener('resize', handleResize);
  
  // Load WhatsApp accounts if not already loaded
  await whatsAppStore.loadAccounts();
  
  // Set default account
  if (availableAccounts.value.length > 0 && !selectedAccountId.value) {
    selectedAccountId.value = availableAccounts.value[0].id;
  }
  
  // Load conversations
  await refreshConversations();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.whatsapp-inbox-page {
  height: calc(100vh - var(--header-height, 64px));
}
</style>
