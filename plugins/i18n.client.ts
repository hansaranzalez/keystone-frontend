// Plugin to handle i18n initialization on the client side
import type { Ref } from 'vue';

// Define types for i18n to fix TypeScript errors
interface I18n {
  locale: Ref<string>;
}

export default defineNuxtPlugin((nuxtApp) => {
  // Access i18n instance directly through nuxtApp
  const i18n = nuxtApp.$i18n as I18n;

  // Function to initialize locale from storage
  const initLocaleFromStorage = () => {
    if (process.client) {
      const storedLocale = localStorage.getItem('user-locale');
      if (storedLocale && ['en', 'es'].includes(storedLocale)) {
        // Set locale from storage if valid
        i18n.locale.value = storedLocale;
        console.log(`[i18n] Initialized locale from storage: ${storedLocale}`);
      } else {
        // Save current locale to storage
        localStorage.setItem('user-locale', i18n.locale.value);
        console.log(`[i18n] Saved current locale to storage: ${i18n.locale.value}`);
      }
    }
  };

  // Check if the DOM is already loaded
  if (process.client && document.readyState === 'complete') {
    initLocaleFromStorage();
  } else {
    // Otherwise wait for the DOM to be fully loaded
    nuxtApp.hook('app:mounted', () => {
      initLocaleFromStorage();
    });
  }
  
  return {
    provide: {
      initLocale: initLocaleFromStorage
    }
  };
});
