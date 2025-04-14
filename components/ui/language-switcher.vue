<template>
  <UPopover :ui="{ width: 'w-48' }" mode="click">
    <!-- Language button with current language flag (responsive design) -->
    <UButton
      color="gray"
      variant="ghost"
      class="relative min-w-0 p-1.5"
      aria-label="Select language"
    >
      <div class="flex items-center">
        <span v-if="currentLocale === 'en'" class="text-lg sm:text-xl">🇺🇸</span>
        <span v-else-if="currentLocale === 'es'" class="text-lg sm:text-xl">🇪🇸</span>
        <span class="hidden sm:inline-block text-sm font-medium ml-2">{{ getLanguageLabel(currentLocale) }}</span>
      </div>
    </UButton>

    <template #content>
      <div class="p-1">
        <!-- Language options -->
        <UButton
          v-for="locale in availableLocales"
          :key="locale"
          block
          :color="currentLocale === locale ? 'primary' : 'gray'"
          :variant="currentLocale === locale ? 'soft' : 'ghost'"
          class="justify-start px-4 py-2 mb-1"
          @click="switchLanguage(locale)"
        >
          <span class="text-lg mr-2">{{ locale === 'en' ? '🇺🇸' : '🇪🇸' }}</span>
          {{ getLanguageLabel(locale) }}
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Use the i18n composable to access locale functions
// This follows the functional programming pattern with explicit composable usage
const { locale, availableLocales, t } = useI18n();

// Current active locale as a computed property (pure function of locale.value)
const currentLocale = computed(() => locale.value);

/**
 * Pure function to get the display name for each language
 * @param {string} code - The language code
 * @returns {string} The localized language name
 */
const getLanguageLabel = (code) => {
  const labels = {
    'en': t('system.languages.english'),
    'es': t('system.languages.spanish')
  };
  return labels[code] || code;
};

/**
 * Function to switch the application language
 * @param {string} newLocale - The new locale to set
 */
const switchLanguage = (newLocale) => {
  // Set the new locale
  locale.value = newLocale;
  
  // Save preference to localStorage for persistence
  if (process.client) {
    localStorage.setItem('user-locale', newLocale);
  }
};
</script>
