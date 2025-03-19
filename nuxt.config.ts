import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  css: ['~/assets/styles/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/image', '@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n', '@vueuse/nuxt'],
  i18n: {
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'es',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'es',
        name: 'Español',
        file: 'es.json'
      }
      // Add more languages as needed
    ]
  },
  plugins: ["~/plugins/pinia.client.ts", "~/plugins/services.client.ts"],
  runtimeConfig: {
    apiKey: process.env.NUXT_API_KEY,
    public: {
      apiUrl: process.env.NUXT_ENV === 'development' ? process.env.NUXT_DEVELOPMENT_API_URL : process.env.NUXT_PRODUCTION_API_URL // Public (accessible on client)
    }
  },
})