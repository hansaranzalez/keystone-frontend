<template>
  <div class="min-h-screen flex items-center justify-center">
    <!-- This page simply handles the password reset parameters and redirects -->
    <div v-if="loading" class="text-center">
      <p class="text-white mb-4">{{ $t('common.loading') }}</p>
      <div class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, AuthForms } from '~/store/authStore';
import { verifyPasswordResetCode } from '~/services/auth.service';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);

// Process password reset on page load
onMounted(async () => {
  try {
    // Extract code and email from the URL
    const code = route.query.code as string;
    const email = route.query.email as string;

    // Handle missing parameters
    if (!code || !email) {
      authStore.setSelectedForm(AuthForms.REQUEST_PASSWORD_RESET);
      await router.push('/');
      return;
    }

    // Store the email for verification
    authStore.setCatchedEmail(email);
    
    try {
      // Verify the code
      await verifyPasswordResetCode(code);
      
      // Store the verification code for the password change form
      authStore.setChangePasswordCode(code);
      
      // Set the form to password reset
      authStore.setSelectedForm(AuthForms.RESET_PASSWORD);
    } catch (error) {
      // If verification fails, show the manual code entry form
      authStore.setSelectedForm(AuthForms.ACTIVATE_PASSWORD_RESET);
    }
    
    // Redirect to the home page where the auth form will be shown
    await router.push('/');
  } finally {
    loading.value = false;
  }
});
</script>
