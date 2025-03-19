<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-950"
  >
    <!-- Logo/Branding Area -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-medium text-blue-500">KEYSTONE</h1>
    </div>

    <!-- Success Card -->
    <UCard
      class="w-full max-w-md bg-gray-900 border border-gray-800"
      :ui="{
        root: 'rounded-lg overflow-hidden',
        body: 'p-6 sm:p-8',
        header: 'p-4',
        footer: 'p-4',
      }"
    >
      <UCardBody class="text-center space-y-6">
        <!-- Success Icon -->
        <div class="flex items-center justify-center">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 text-6xl" />
        </div>

        <!-- Success Message -->
        <h2 class="text-xl font-medium text-white">
          {{ $t('passwordChangeSuccess.title') }}
        </h2>
        <p class="text-gray-400">
          {{ $t('passwordChangeSuccess.message') }}
        </p>

        <!-- Back to Login Button -->
        <UButton
          size="lg"
          color="primary"
          block
          variant="soft"
          class="mt-6"
          @click="setSelectedForm(AuthForms.LOGIN)"
        >
          {{ $t('passwordChangeSuccess.backToLogin') }}
        </UButton>
      </UCardBody>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore, AuthForms } from "~/store/authStore";
const { setSelectedForm } = useAuthStore();
</script>
