// WhatsApp integration plugin for Nuxt
import { setWhatsAppEndpoints as setWhatsAppMainEndpoints } from '~/services/whatsapp.service';
import { setWhatsAppEndpoints as setWhatsAppMessageEndpoints } from '~/services/whatsapp-message.service';
import { setWhatsAppAccountEndpoints } from '~/services/whatsapp-account.service';

export default defineNuxtPlugin(nuxtApp => {
  // Wait for the endpoints plugin to be ready
  nuxtApp.hook('app:created', () => {
    // Get the centralized endpoints from the Nuxt app
    const $endpoints = nuxtApp.$endpoints;
    
    // Set the WhatsApp service endpoints
    if ($endpoints) {
      setWhatsAppMainEndpoints($endpoints);
      setWhatsAppMessageEndpoints($endpoints);
      setWhatsAppAccountEndpoints($endpoints);
      console.log('WhatsApp services initialized with centralized endpoints');
    } else {
      console.warn('WhatsApp services initialized with default endpoints (centralized endpoints not available)');
    }
  });
});
