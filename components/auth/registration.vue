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
        {{ $t("registration.title") }}
      </h2>

      <!-- Google Registration Button -->
      <UButton
        size="lg"
        color="info"
        variant="ghost"
        block
        class="mb-4"
        :ui="{
          base: 'relative rounded-md inline-flex items-center justify-center focus:outline-none focus-visible:outline-none ring-1 ring-gray-700',
          label: 'flex-1 text-teal-400',
        }"
        @click="googleSignup"
      >
        <template #leading>
          <UIcon name="i-mdi-google" class="size-5" />
        </template>
        {{ $t("login.continueWithGoogle") }}
      </UButton>

      <!-- Facebook Registration Button -->
      <UButton
        size="lg"
        color="info"
        variant="ghost"
        block
        class="mb-6"
        :ui="{
          base: 'relative rounded-md inline-flex items-center justify-center focus:outline-none focus-visible:outline-none ring-1 ring-gray-700',
          label: 'flex-1 text-blue-400',
        }"
        @click="facebookSignup"
      >
        <template #leading>
          <UIcon name="i-mdi-facebook" class="size-5" />
        </template>
        {{ $t("login.continueWithFacebook") }}
      </UButton>

      <!-- Simple OR Divider -->
      <div class="text-center text-gray-500 mb-6">
        {{ $t("common.or").toUpperCase() }}
      </div>

      <!-- Registration Form for Mobile -->
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- Name Field -->
        <UFormField
          :label="$t('registration.formLabels.name')"
          name="name"
        >
          <UInput
            v-model="state.name"
            type="text"
            size="xl"
            autocomplete="name"
            :placeholder="$t('registration.formPlaceholders.name')"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-user"
                class="text-gray-400 size-5"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Email Field -->
        <UFormField
          :label="$t('registration.formLabels.email')"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            size="xl"
            autocomplete="email"
            :placeholder="$t('registration.formPlaceholders.email')"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-envelope"
                class="text-gray-400 size-5"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Password Field -->
        <UFormField
          :label="$t('registration.formLabels.password')"
          name="password"
        >
          <UInput
            v-model="state.password"
            size="xl"
            autocomplete="new-password"
            :placeholder="$t('registration.formPlaceholders.password')"
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
          <template #hint>
            <span class="text-xs text-gray-500">
              {{ $t('registration.formLabels.passwordHint') }}
            </span>
          </template>
        </UFormField>

        <!-- Confirm Password Field -->
        <UFormField
          :label="$t('registration.formLabels.confirmPassword')"
          name="confirmPassword"
        >
          <UInput
            v-model="state.confirmPassword"
            size="xl"
            autocomplete="new-password"
            :placeholder="$t('registration.formPlaceholders.confirmPassword')"
            :type="showConfirmPassword ? 'text' : 'password'"
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
          {{ $t('registration.signUp') }}
        </UButton>

        <!-- Error Message -->
        <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
          {{ errorMessage }}
        </p>
      </UForm>

      <!-- Already have account link -->
      <div class="flex justify-center py-4 text-sm">
        <UButton
          variant="link"
          color="secondary"
          size="sm"
          @click="setSelectedForm(AuthForms.LOGIN)"
        >
          {{ $t("registration.haveAccount") }}
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
          {{ $t("registration.title") }}
        </h2>

        <!-- Google Registration Button -->
        <UButton
          size="lg"
          color="info"
          variant="ghost"
          block
          class="mb-4"
          :ui="{
            base: 'relative rounded-md inline-flex items-center justify-center focus:outline-none focus-visible:outline-none ring-1 ring-gray-700',
            label: 'flex-1 text-teal-400',
          }"
          @click="googleSignup"
        >
          <template #leading>
            <UIcon name="i-mdi-google" class="size-5" />
          </template>
          {{ $t("login.continueWithGoogle") }}
        </UButton>

        <!-- Facebook Registration Button -->
        <UButton
          size="lg"
          color="info"
          variant="ghost"
          block
          class="mb-6"
          :ui="{
            base: 'relative rounded-md inline-flex items-center justify-center focus:outline-none focus-visible:outline-none ring-1 ring-gray-700',
            label: 'flex-1 text-blue-400',
          }"
          @click="facebookSignup"
        >
          <template #leading>
            <UIcon name="i-mdi-facebook" class="size-5" />
          </template>
          {{ $t("login.continueWithFacebook") }}
        </UButton>

        <!-- Simple OR Divider -->
        <div class="text-center text-gray-500 mb-6">
          {{ $t("common.or").toUpperCase() }}
        </div>

        <!-- Registration Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- Name Field -->
          <UFormField
            :label="$t('registration.formLabels.name')"
            name="name"
          >
            <UInput
              v-model="state.name"
              type="text"
              size="xl"
              autocomplete="name"
              :placeholder="$t('registration.formPlaceholders.name')"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-user"
                  class="text-gray-400 size-5"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Email Field -->
          <UFormField
            :label="$t('registration.formLabels.email')"
            name="email"
          >
            <UInput
              v-model="state.email"
              type="email"
              size="xl"
              autocomplete="email"
              placeholder="email@example.com"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-envelope"
                  class="text-gray-400 size-5"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Password Field -->
          <UFormField
            :label="$t('registration.formLabels.password')"
            name="password"
          >
            <UInput
              v-model="state.password"
              size="xl"
              autocomplete="new-password"
              placeholder="••••••••"
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
            :label="$t('registration.formLabels.confirmPassword')"
            name="confirmPassword"
          >
            <UInput
              v-model="state.confirmPassword"
              size="xl"
              autocomplete="new-password"
              placeholder="••••••••"
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
            {{ $t('registration.signUp') }}
          </UButton>

          <!-- Error Message -->
          <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
            {{ errorMessage }}
          </p>
        </UForm>
      </UCardBody>

      <!-- Already have account link -->
      <div class="flex justify-center py-4 text-sm">
        <UButton
          variant="link"
          color="secondary"
          size="sm"
          @click="setSelectedForm(AuthForms.LOGIN)"
        >
          {{ $t("registration.haveAccount") }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { useAuthStore, AuthForms } from "~/store/authStore";
import { useNuxtApp } from "#app";

const { t } = useI18n();
const { setSelectedForm } = useAuthStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation schema
const schema = object({
  name: string().required(t('registration.validationMessages.nameRequired')),
  email: string()
    .email(t('registration.validationMessages.incorrectEmailFormat'))
    .required(t('registration.validationMessages.emailRequired')),
  password: string()
    .min(8, t('registration.validationMessages.passwordMin'))
    .required(t('registration.validationMessages.passwordRequired')),
  confirmPassword: string()
    .oneOf([yupRef('password')], t('registration.validationMessages.passwordMatch'))
    .required(t('registration.validationMessages.confirmPasswordRequired')),
});

type Schema = InferType<typeof schema>;

// Form state with proper types
const state = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}) as { name: string; email: string; password: string; confirmPassword: string };

const loading = ref(false);
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

  try {
    await schema.validate(state);

    if (!state.name || !state.email || !state.password || !state.confirmPassword) return;

    await useAuthService().register(state.name, state.email, state.password);
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}

// Social signup handlers
const googleSignup = () => {
  useAuthService().initGoogleLoginFlow();
}

const facebookSignup = () => {
  useAuthService().initFacebookLoginFlow(t);
};
</script>
