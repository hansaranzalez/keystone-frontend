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
        {{ $t("activatePassword.title") }}
      </h2>

      <!-- Activation Form for Mobile -->
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="$t('activatePassword.formLabels.activationCode')"
          name="activationCode"
        >
          <UInput
            v-model="state.activationCode"
            type="text"
            size="xl"
            placeholder="Enter your 6-digit code"
            maxlength="6"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-key"
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
          {{ $t('activatePassword.verifyCode') }}
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
          @click="navigateToLogin"
        >
          {{ $t('activatePassword.goBackToLogin') }}
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
          {{ $t("activatePassword.title") }}
        </h2>

        <!-- Activation Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            :label="$t('activatePassword.formLabels.activationCode')"
            name="activationCode"
          >
            <UInput
              v-model="state.activationCode"
              type="text"
              size="xl"
              placeholder="Enter your 6-digit code"
              maxlength="6"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-key"
                  class="text-gray-400 size-5"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Success Message -->
          <p v-if="successMessage" class="mt-4 text-sm text-center text-green-500">
            {{ successMessage }}
          </p>

          <!-- Error Message -->
          <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
            {{ errorMessage }}
          </p>

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
            {{ $t("activatePassword.submit") }}
          </UButton>
          
          <!-- Cancel Button -->
          <UButton
            type="button"
            variant="link"
            color="secondary"
            size="sm"
            class="w-full mt-2"
            :disabled="loading"
            @click="navigateToLogin"
          >
            {{ $t("cancel") }}
          </UButton>
        </UForm>
      </UCardBody>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { AuthForms, useAuthStore } from "~/store/authStore";
import { storeToRefs } from "pinia";

const { t } = useI18n();

const { catchedEmailGetter } = storeToRefs(useAuthStore());

// Validation schema
const schema = object({
  activationCode: string()
    .length(6, t("activatePassword.validationMessages.codeLength"))
    .required(t("activatePassword.validationMessages.codeRequired")),
});

type Schema = InferType<typeof schema>;

// Form state with proper typing
const state = reactive({
  activationCode: "",
}) as { activationCode: string };

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Reset form
function resetForm() {
  state.activationCode = "";
  successMessage.value = "";
  errorMessage.value = "";
}

// navigate to login page
function navigateToLogin() {
  resetForm();
  useAuthStore().setSelectedForm(AuthForms.LOGIN);
}

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  await schema.validate(state);

  if (!state.activationCode) return;

  try {
    if (!catchedEmailGetter.value) return;
    const response = await useAuthService().verifyPasswordResetCode(
      state.activationCode,
      t
    );
    successMessage.value = t("activatePassword.successMessage");
    useAuthStore().setSelectedForm(AuthForms.RESET_PASSWORD);
  } catch (error: any) {
    console.log(error);
    errorMessage.value =
      error.response?.data?.message || t("activatePassword.errorMessage");
  } finally {
    loading.value = false;
  }
}
</script>
