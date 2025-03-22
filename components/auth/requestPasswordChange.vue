<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-950"
  >
    <!-- Logo/Branding Area -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-medium text-blue-500">KEYSTONE</h1>
    </div>

    <!-- Mobile version - no card (visible on small screens only) -->
    <div class="w-full max-w-md block sm:hidden">
      <!-- Title -->
      <h2 class="text-xl font-medium text-center mb-6 text-white">
        {{ $t('passwordChange.title') }}
      </h2>

      <!-- Password Change Request Form for Mobile -->
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- Email Field -->
        <UFormField
          :label="$t('passwordChange.formLabels.email')"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            size="xl"
            placeholder="Enter your email"
            autocomplete="email"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-envelope"
                class="text-gray-400 size-5"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Submit Button -->
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          variant="soft"
          class="mt-6"
          :loading="loading"
        >
          {{ $t('passwordChange.request') }}
        </UButton>

        <!-- Success Message -->
        <p v-if="successMessage" class="mt-4 text-sm text-center text-green-500">
          {{ successMessage }}
        </p>

        <!-- Error Message -->
        <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
          {{ errorMessage }}
        </p>
      </UForm>

      <!-- Go back to login link -->
      <div class="flex justify-center py-4 text-sm">
        <UButton
          variant="link"
          color="secondary"
          size="sm"
          @click="setSelectedForm(AuthForms.LOGIN)"
        >
          {{ $t('passwordChange.goBackToLogin') }}
        </UButton>
      </div>
    </div>

    <!-- Desktop version - with card (visible on medium screens and up) -->
    <UCard
      class="hidden sm:block w-full max-w-md bg-slate-900 border border-slate-800"
      :ui="{
        root: 'rounded-lg overflow-hidden',
        body: 'p-6 sm:p-8',
        header: 'p-4',
        footer: 'p-4',
      }"
    >
      <UCardBody>
        <!-- Title -->
        <h2 class="text-xl font-medium text-center mb-6 text-white">
          {{ $t('passwordChange.title') }}
        </h2>

        <!-- Password Change Request Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- Email Field -->
          <UFormField
            :label="$t('passwordChange.formLabels.email')"
            name="email"
          >
            <UInput
              v-model="state.email"
              type="email"
              size="xl"
              placeholder="Enter your email"
              autocomplete="email"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-envelope"
                  class="text-gray-400 size-5"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Submit Button -->
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            variant="soft"
            class="mt-6"
            :loading="loading"
          >
            {{ $t('passwordChange.request') }}
          </UButton>
          
          <!-- Success Message -->
          <p v-if="successMessage" class="mt-4 text-sm text-center text-green-500">
            {{ successMessage }}
          </p>

          <!-- Error Message -->
          <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
            {{ errorMessage }}
          </p>
        </UForm>
      </UCardBody>
      <UCardFooter class="flex justify-center p-4 border-t border-gray-800">
        <UButton 
          @click="setSelectedForm(AuthForms.LOGIN)" 
          icon="i-heroicons-arrow-left" 
          size="sm" 
          variant="link" 
          color="secondary"
        >
          {{ $t('passwordChange.goBackToLogin') }}
        </UButton>
      </UCardFooter>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { useAuthStore, AuthForms } from "~/store/authStore";

const { t } = useI18n();
const { setSelectedForm, setCatchedEmail } = useAuthStore();

// Validation schema
const schema = object({
    email: string()
        .email(t('passwordChange.validationMessages.incorrectEmailFormat'))
        .required(t('passwordChange.validationMessages.emailRequired')),
});

type Schema = InferType<typeof schema>;

// Form state with proper typing
const state = reactive({
    email: "",
}) as { email: string };

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    await schema.validate(state);

    if (!state.email) return;

    try {
        await useAuthService().requestPasswordChange(state.email);
        successMessage.value = t('passwordChange.successMessage');
        setCatchedEmail(state.email);
        setSelectedForm(AuthForms.ACTIVATE_PASSWORD_RESET)
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.response.data.message || t('passwordChange.errorMessage');
    } finally {
        loading.value = false;
    }
}
</script>
