<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-950"
  >
    <!-- Logo/Branding Area -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-medium text-blue-500">KEYSTONE</h1>
    </div>

    <!-- Change Password Card -->
    <UCard
      class="w-full max-w-md bg-gray-900 border border-gray-800"
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
          {{ $t('changePassword.title') }}
        </h2>

        <!-- Change Password Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- New Password Field -->
          <UFormField
            :label="$t('changePassword.formLabels.newPassword')"
            name="newPassword"
          >
            <UInput
              v-model="state.newPassword"
              size="xl"
              autocomplete="new-password"
              placeholder="Enter your new password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-lock-closed"
                  class="text-gray-400 size-5"
                />
              </template>
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="togglePasswordVisibility"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Confirm Password Field -->
          <UFormField
            :label="$t('changePassword.formLabels.confirmPassword')"
            name="confirmPassword"
          >
            <UInput
              v-model="state.confirmPassword"
              size="xl"
              autocomplete="new-password"
              placeholder="Confirm your new password"
              :type="showConfirmPassword ? 'text' : 'password'"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-shield-check"
                  class="text-gray-400 size-5"
                />
              </template>
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showConfirmPassword"
                  aria-controls="confirmPassword"
                  @click="toggleConfirmPasswordVisibility"
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
            {{ $t('changePassword.submit') }}
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
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";

const { t } = useI18n();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation schema
const schema = object({
  newPassword: string()
    .min(8, t('changePassword.validationMessages.passwordMin'))
    .required(t('changePassword.validationMessages.passwordRequired')),
  confirmPassword: string()
    .oneOf([yupRef('newPassword')], t('changePassword.validationMessages.passwordMatch'))
    .required(t('changePassword.validationMessages.confirmPasswordRequired')),
});

type Schema = InferType<typeof schema>;

// Form state
const state = reactive({
  newPassword: undefined,
  confirmPassword: undefined,
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await schema.validate(state);

    if (!state.newPassword || !state.confirmPassword) return;

    await useAuthService().changePassword(state.newPassword);
    successMessage.value = t('changePassword.successMessage');
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error.response?.data?.message || t('changePassword.errorMessage');
  } finally {
    loading.value = false;
  }
}
</script>
