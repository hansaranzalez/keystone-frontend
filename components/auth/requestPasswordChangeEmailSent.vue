<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <UCard class="w-full max-w-md p-6">
            <UCardBody class="text-center space-y-6">
                <!-- Success Icon -->
                <div class="flex items-center justify-center">
                    <UIcon name="mdi-email-check-outline" class="text-blue-500 text-6xl" />
                </div>
                

                <!-- Success Message -->
                <h1 class="text-2xl">
                    {{ $t('passwordResetRequestSuccess.title') }}
                </h1>
                <p class="text-gray-400">
                    {{ $t('passwordResetRequestSuccess.message') }}
                </p>

                <!-- Back to Login Button -->
                <UButton
                    size="xl"
                    color="primary"
                    block
                    :label="$t('passwordResetRequestSuccess.backToLogin')"
                    @click="setSelectedForm(AuthForms.LOGIN)"
                />
            </UCardBody>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore, AuthForms } from "~/store/authStore";
const { setSelectedForm } = useAuthStore();
</script>
