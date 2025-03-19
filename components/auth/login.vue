<template>
  <div
    class="min-h-screen flex flex-col space-y-5 items-center justify-center bg-gray-900"
  >
    <h1 class="text-2xl font-normal text-center mb-6">
      {{ $t("login.title") }}
    </h1>
    <UCard class="w-full max-w-md p-6">
      <UCardBody>
        <div class="space-y-6">
          <div class="space-y-5 flex flex-col items-center justify-center pt-3">
            <UButton
              size="xl"
              color="red"
              icon="mdi-google"
              :label="$t('login.continueWithGoogle')"
              @click="googleLogin"
              block
            />
            <!-- <UButton size="xl" color="indigo" icon="mdi-facebook" :label="$t('login.loginWithFacebook')"
                            @click="facebookLogin" block /> -->
            <!-- Error Message -->
          </div>
          <UDivider :label="$t('common.or')" />
          <!-- Login Form -->
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
          >
            <UFormGroup
              :label="$t('login.formLabels.email')"
              name="email"
              class="block"
            >
              <UInput
                size="xl"
                v-model="state.email"
                type="email"
                placeholder="Enter your email"
                class="mt-2"
              />
            </UFormGroup>

            <UFormGroup
              :label="$t('login.formLabels.password')"
              name="password"
              class="block"
            >
              <UInput
                size="xl"
                v-model="state.password"
                type="password"
                placeholder="Enter your password"
                class="mt-2"
              />
            </UFormGroup>

            <UButton
              type="submit"
              color="gray"
              :loading="loading"
              block
              size="xl"
            >
              {{ $t("login.signIn") }}
            </UButton>
          </UForm>

          <p v-if="errorMessage" class="text-red-500 text-center mt-6">
            {{ errorMessage }}
          </p>
        </div>
      </UCardBody>
    </UCard>
    <UCard class="w-full max-w-md px-6" :ui="{ base: 'border-none' }">
      <UCardFooter>
        <div>
          <UButton
            @click="setSelectedForm(AuthForms.REQUEST_PASSWORD_RESET)"
            :label="$t('login.forgotPassword')"
            size="xl"
            variant="link"
            color="primary"
          />
        </div>
        <div>
          <UButton
            @click="setSelectedForm(AuthForms.REGISTRATION)"
            :label="$t('registration.createAccount')"
            size="xl"
            variant="link"
            color="primary"
          />
        </div>
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
const { setSelectedForm } = useAuthStore();

// Validation schema
const schema = object({
  email: string()
    .email(t("login.validationMessages.incorrectEmailFormat"))
    .required(t("login.validationMessages.emailRequired")),
  password: string().required(t("login.validationMessages.passwordRequired")),
});

type Schema = InferType<typeof schema>;

// Form state
const state = reactive({
  email: undefined,
  password: undefined,
});

const loading = ref(false);
const errorMessage = ref("");

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMessage.value = "";
  await schema.validate(state);
  if (!state.email || !state.password) return;
  try {
    await useAuthService().login(state.email, state.password);
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error.response.data.message || "Login failed";
  } finally {
    loading.value = false;
  }
}

// Social login handlers
const googleLogin = () => {
  useAuthService().initGoogleLoginFlow();
};
const facebookLogin = () => alert("Facebook login clicked!");

const getCodeFromUrl = () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  return code;
};

onMounted(() => {
  const code = getCodeFromUrl();
  if (!code) return;
  useAuthService().receiveGoogleCallback(code);
});
</script>
