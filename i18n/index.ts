import en from "./locales/en";
import es from "./locales/es";

export default defineI18nConfig(() => { 
  console.log('TRANSLATIONS LOADED', en, es)
  return {
    legacy: false,
    locale: 'es',
    fallbackLocale: 'es',
    messages: {
      en,
      es,
    },
    escapeParameter: true
  }});
  

