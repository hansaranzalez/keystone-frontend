<template>
  <div
    class="min-h-screen flex flex-col space-y-5 items-center justify-center bg-gray-900"
  >
    <h1 class="text-2xl font-normal text-center mb-6">
      {{ $t("activatePassword.title") }}
    </h1>
    <UCard class="w-full max-w-md p-6">
      <UCardBody>
        <div class="space-y-6">
          <!-- Activation Form -->
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
          >
            <UFormGroup
              :label="$t('activatePassword.formLabels.activationCode')"
              name="activationCode"
              class="block"
            >
              <UInput
                size="xl"
                v-model="state.activationCode"
                type="text"
                placeholder="Enter your 6-digit code"
                maxlength="6"
                class="mt-2"
              />
            </UFormGroup>

            <!-- Success Message -->
            <p v-if="successMessage" class="text-green-500 text-center mt-6">
              {{ successMessage }}
            </p>

            <!-- Error Message -->
            <p v-if="errorMessage" class="text-red-500 text-center mt-6">
              {{ errorMessage }}
            </p>

            <UButton
              type="submit"
              color="gray"
              :loading="loading"
              block
              size="xl"
            >
              {{ $t("activatePassword.submit") }}
            </UButton>
            <UButton
              type="button"
              variant="link"
              color="gray"
              :disabled="loading"
              block
              size="xl"
              @click="navigateToLogin"
            >
              {{ $t("cancel") }}
            </UButton>
          </UForm>
        </div>
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

// Form state
const state = reactive({
  activationCode: undefined,
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Reset form
function resetForm() {
  state.activationCode = undefined;
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
      catchedEmailGetter.value,
      state.activationCode
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
