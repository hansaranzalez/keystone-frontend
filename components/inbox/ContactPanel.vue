<template>
  <div class="p-4 overflow-auto max-h-[70vh]">
    <!-- Contact header -->
    <div class="flex items-center mb-4">
      <UAvatar
        :alt="contact.name"
        :src="contact.avatar"
        size="lg"
        class="mr-4"
      />
      <div>
        <h3 class="font-medium text-lg">{{ contact.name }}</h3>
        <div class="flex flex-col mt-1 space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <div v-if="contact.phone" class="flex items-center">
            <UIcon name="i-lucide-phone" class="h-3.5 w-3.5 mr-1.5" />
            <span>{{ contact.phone }}</span>
          </div>
          <div v-if="contact.email" class="flex items-center">
            <UIcon name="i-lucide-mail" class="h-3.5 w-3.5 mr-1.5" />
            <span>{{ contact.email }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs for contact info, notes, etc. -->
    <UTabs :items="contactTabs">
      <template #info="{ item }">
        <div class="py-2">
          <!-- Key information section -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2 text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.keyInfo') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.source') }}</span>
                <span class="text-sm font-medium">{{ $t('inbox.contact.websiteLead') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.status') }}</span>
                <UBadge color="emerald" variant="soft" size="sm">{{ $t('inbox.contact.activeLead') }}</UBadge>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.lastContact') }}</span>
                <span class="text-sm font-medium">
                  {{ formatDate(new Date()) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Custom fields section -->
          <div>
            <h4 class="text-sm font-medium mb-2 text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.customFields') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.budget') }}</span>
                <span class="text-sm font-medium">$450,000 - $500,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.area') }}</span>
                <span class="text-sm font-medium">{{ $t('inbox.contact.oakDistrict') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.propertyType') }}</span>
                <span class="text-sm font-medium">{{ $t('inbox.contact.singleFamilyHome') }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <template #notes="{ item }">
        <div class="py-2">
          <!-- Notes list -->
          <div v-if="contact.notes && contact.notes.length">
            <div 
              v-for="(note, index) in contact.notes" 
              :key="index"
              class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 mb-2"
            >
              <p class="text-sm">{{ note }}</p>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-4">
            <UIcon name="i-lucide-clipboard" class="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.noNotes') }}</p>
          </div>
          
          <!-- Add note form -->
          <div class="mt-4">
            <UTextarea
              v-model="newNote"
              :placeholder="$t('inbox.contact.addNotePlaceholder')"
              class="w-full mb-2"
              rows="2"
              autoresize
            />
            <UButton
              color="primary"
              size="sm"
              :disabled="!newNote.trim()"
              @click="addNote"
            >
              {{ $t('inbox.contact.addNote') }}
            </UButton>
          </div>
        </div>
      </template>
      
      <template #followups="{ item }">
        <div class="py-2">
          <!-- Upcoming follow-ups list -->
          <div v-if="followUps.length" class="space-y-2 mb-4">
            <div 
              v-for="(followUp, index) in followUps" 
              :key="index"
              class="p-3 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div class="flex justify-between items-start mb-1">
                <h5 class="font-medium text-sm">{{ followUp.title }}</h5>
                <UBadge 
                  :color="getFollowUpStatusColor(followUp.date)" 
                  variant="soft" 
                  size="sm"
                >
                  {{ formatFollowUpDate(followUp.date) }}
                </UBadge>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">{{ followUp.description }}</p>
              <div class="flex justify-end">
                <UButton
                  color="gray"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-check"
                  @click="completeFollowUp(index)"
                >
                  {{ $t('inbox.contact.complete') }}
                </UButton>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-4 mb-4">
            <UIcon name="i-lucide-calendar" class="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('inbox.contact.noFollowUps') }}</p>
          </div>
          
          <!-- Add follow-up button -->
          <UButton
            color="primary"
            size="sm"
            block
            icon="i-lucide-plus"
            @click="showFollowUpForm = !showFollowUpForm"
          >
            {{ $t('inbox.contact.scheduleFollowUp') }}
          </UButton>
          
          <!-- Follow-up form -->
          <div v-if="showFollowUpForm" class="mt-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
            <h5 class="font-medium text-sm mb-3">{{ $t('inbox.contact.newFollowUp') }}</h5>
            
            <UFormGroup class="mb-3" :label="$t('inbox.contact.title')">
              <UInput v-model="followUpForm.title" />
            </UFormGroup>
            
            <UFormGroup class="mb-3" :label="$t('inbox.contact.date')">
              <UDatepicker v-model="followUpForm.date" />
            </UFormGroup>
            
            <UFormGroup class="mb-3" :label="$t('inbox.contact.description')">
              <UTextarea v-model="followUpForm.description" rows="2" />
            </UFormGroup>
            
            <div class="flex justify-end space-x-2">
              <UButton
                color="gray"
                variant="ghost"
                size="sm"
                @click="showFollowUpForm = false"
              >
                {{ $t('common.cancel') }}
              </UButton>
              <UButton
                color="primary"
                size="sm"
                :disabled="!isFollowUpFormValid"
                @click="addFollowUp"
              >
                {{ $t('common.save') }}
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, isBefore, isToday, addDays } from 'date-fns'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

// i18n
const { t } = useI18n()

// Contact tabs
const contactTabs = [
  {
    label: t('inbox.contact.tabs.info'),
    slot: 'info'
  },
  {
    label: t('inbox.contact.tabs.notes'),
    slot: 'notes'
  },
  {
    label: t('inbox.contact.tabs.followUps'),
    slot: 'followups'
  }
]

// Notes state
const newNote = ref('')

// Add a note
const addNote = () => {
  if (!newNote.value.trim()) return
  
  // In a real app, we would call the API to add the note
  if (!props.contact.notes) {
    props.contact.notes = []
  }
  props.contact.notes.push(newNote.value)
  newNote.value = ''
}

// Follow-ups state
const showFollowUpForm = ref(false)
const followUpForm = ref({
  title: '',
  date: new Date(),
  description: ''
})

// Sample follow-ups (would come from API in a real app)
const followUps = ref([
  {
    id: 1,
    title: 'Property Viewing',
    date: addDays(new Date(), 2),
    description: 'Schedule a viewing of 123 Oak St property'
  },
  {
    id: 2,
    title: 'Loan Pre-Approval',
    date: addDays(new Date(), 5),
    description: 'Follow up on loan pre-approval status'
  }
])

// Form validation
const isFollowUpFormValid = computed(() => {
  return followUpForm.value.title.trim() && followUpForm.value.date
})

// Add a follow-up
const addFollowUp = () => {
  if (!isFollowUpFormValid.value) return
  
  // In a real app, we would call the API to add the follow-up
  followUps.value.push({
    id: Date.now(),
    title: followUpForm.value.title,
    date: followUpForm.value.date,
    description: followUpForm.value.description
  })
  
  // Sort by date
  followUps.value.sort((a, b) => a.date.getTime() - b.date.getTime())
  
  // Reset form
  followUpForm.value = {
    title: '',
    date: new Date(),
    description: ''
  }
  showFollowUpForm.value = false
}

// Complete a follow-up
const completeFollowUp = (index: number) => {
  // In a real app, we would call the API to mark the follow-up as complete
  followUps.value.splice(index, 1)
}

// Format date for display
const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy')
}

// Format follow-up date with relative time
const formatFollowUpDate = (date: Date) => {
  if (isToday(date)) {
    return t('inbox.contact.today')
  }
  return format(date, 'MMM d')
}

// Get color based on follow-up status
const getFollowUpStatusColor = (date: Date) => {
  if (isBefore(date, new Date())) {
    return 'red'
  } else if (isToday(date)) {
    return 'orange'
  } else {
    return 'green'
  }
}
</script>
