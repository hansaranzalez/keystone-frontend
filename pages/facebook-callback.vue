<script lang="ts" setup>
import { receiveFacebookCallback } from '~/services/auth.service';

onMounted(async () => {
  const route = useRoute();
  const token = route.query.token as string;
  
  try {
    // Process the Facebook callback
    await receiveFacebookCallback(token);
  } catch (error) {
    console.error('Error in Facebook callback page:', error);
    // In case of error, redirect to login
    navigateTo('/login');
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex justify-center">
          <h3 class="text-lg font-semibold">{{ $t('login.processingAuth') }}</h3>
        </div>
      </template>
      
      <div class="flex flex-col items-center justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="text-primary text-2xl animate-spin" />
        <p class="text-center mt-4">{{ $t('login.redirecting') }}</p>
      </div>
    </UCard>
  </div>
</template>
