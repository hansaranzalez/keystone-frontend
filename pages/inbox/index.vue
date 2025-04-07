<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
    <UPageHeader :title="$t('inbox.title')" class="px-4 flex-shrink-0">
      <template #right>
        <UButton color="primary" size="sm" icon="i-lucide-plus" @click="handleNewMessage">
          {{ $t('inbox.newMessage') }}
        </UButton>
      </template>
    </UPageHeader>

    <div class="flex-1 flex overflow-hidden">
      <!-- Inbox container component with full height -->
      <InboxContainer class="w-full h-full" />
    </div>
    <UAlert
    v-if="!hasConnectedAccount"
    :orientation="isMobileView ? 'vertical' : 'horizontal'"
    icon="i-lucide-alert-triangle"
    :actions="[
      {
        label: 'Connectar WhatsApp Business',
        variant: 'ghost',
        color: 'primary',
        size: 'md',
        icon: 'grommet-icons-connect',
        to: '/integrations/whatsapp',
      },
    ]"
    :ui="{
      icon: 'size-11'
    }"
    variant="soft" color="warning" :title="$t('integrations.whatsapp.alerts.noConnections')"
      :description="$t('integrations.whatsapp.alerts.noConnectionsMessage')" />
  </div>

</template>

<style>
/* Styles specific to the inbox page */
.inbox-page-container {
  height: 100vh;
  overflow: hidden;
}

/* Make sure only the inbox page has these styles */
.inbox-page-container>*>*>.nuxt-page-root {
  height: calc(100vh - 4rem);
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from '#ui/composables/useToast'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import InboxContainer from '../../components/inbox/InboxContainer.vue'
import { useInboxStore } from '../../store/inbox.store'
import { initInbox } from '../../services/inbox.service'
import { useWhatsAppStore } from '~/store/whatsapp.store'

// Responsive state
const { width } = useWindowSize()
const isMobileView = computed(() => width.value < 1024)

// Add a CSS class to the parent container only for the inbox page
// This will prevent the changes from affecting other pages
onMounted(() => {
  const parentContainer = document.querySelector('#__nuxt');
  if (parentContainer) {
    parentContainer.classList.add('inbox-page-container');
  }

  return () => {
    // Clean up when component is unmounted
    if (parentContainer) {
      parentContainer.classList.remove('inbox-page-container');
    }
  }
});

// Initialize composables
const toast = useToast()
const { t } = useI18n()
const inboxStore = useInboxStore()
const { loading, error } = storeToRefs(inboxStore)


const { hasConnectedAccount } = storeToRefs(useWhatsAppStore())


// Initialize inbox service and load data
onMounted(async () => {
  // Initialize inbox service
  initInbox()

  // Load conversations
  await inboxStore.loadConversations()

  // Show error if any
  if (error.value) {
    toast.add({
      title: t('common.error'),
      description: error.value,
      color: 'error'
    })
  }
})

// Event handlers
const handleNewMessage = () => {
  // This would open a modal or navigate to a new conversation form
  toast.add({
    title: t('inbox.newMessageTitle'),
    description: t('inbox.newMessageDescription'),
    color: 'info'
  })
}
</script>
