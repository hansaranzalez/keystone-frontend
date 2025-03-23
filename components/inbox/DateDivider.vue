<template>
  <div class="flex justify-center my-4">
    <div class="inline-block px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  date: {
    type: Date,
    required: true
  }
})

// i18n
const { t } = useI18n()

// Format the date
const formattedDate = computed(() => {
  const date = new Date(props.date)
  
  if (isToday(date)) {
    return t('inbox.dates.today')
  } else if (isYesterday(date)) {
    return t('inbox.dates.yesterday')
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE') // Full day name
  } else if (isThisYear(date)) {
    return format(date, 'MMMM d') // Month and day
  } else {
    return format(date, 'MMMM d, yyyy') // Full date with year
  }
})
</script>
