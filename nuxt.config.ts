import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  
  // Set SPA mode - no server-side rendering
  ssr: false,
  
  // Optional: Configure static generation settings
  experimental: {
    payloadExtraction: true,
  },
  
  app: {
    head: {
      title: 'Zolara',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    // No page transitions - can cause issues with reloads
    pageTransition: false
  },
  
  // Nitro server configuration
  nitro: {
    preset: 'static',
    compressPublicAssets: true,
    
    // The main SPA configuration - match ALL routes to index.html
    routeRules: {
      '/**': { static: true }
    },
    
    esbuild: {
      options: {
        target: 'es2019'
      }
    }
  },
  css: ['~/assets/styles/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/image', '@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n', '@vueuse/nuxt', 'nuxt-svgo'],
  i18n: {
    vueI18n: '~/i18n/index.ts',
    defaultLocale: 'es',
  },
  svgo: {
    autoImportPath: './assets/svg/',
  },
  plugins: ["~/plugins/pinia.client.ts", "~/plugins/services.client.ts"],
  runtimeConfig: {
    apiKey: process.env.NUXT_API_KEY,
    public: {
      apiUrl: process.env.NUXT_ENV === 'development' ? process.env.NUXT_DEVELOPMENT_API_URL : process.env.NUXT_PRODUCTION_API_URL // Public (accessible on client)
    }
  }
})