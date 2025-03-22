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
        {{ $t("login.title") }}
      </h2>

      <!-- Google Login Button -->
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
        @click="googleLogin"
      >
        <template #leading>
          <UIcon name="i-mdi-google" class="size-5" />
        </template>
        {{ $t("login.continueWithGoogle") }}
      </UButton>

      <!-- Facebook Login Button -->
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
        @click="facebookLogin"
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

      <!-- Login Form for Mobile -->
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- Email Field -->
        <UFormField
          :label="$t('login.formLabels.email')"
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
          :label="$t('login.formLabels.password')"
          name="password"
        >
          <UInput
            v-model="state.password"
            size="xl"
            autocomplete="current-password"
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
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Forgot Password Link -->
        <div class="flex justify-end">
          <UButton
            variant="link"
            color="secondary"
            size="sm"
            @click="setSelectedForm(AuthForms.REQUEST_PASSWORD_RESET)"
          >
            {{ $t("login.forgotPassword") }}
          </UButton>
        </div>

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
          {{ $t('login.signIn') }}
        </UButton>

        <!-- Error Message -->
        <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
          {{ errorMessage }}
        </p>
      </UForm>

      <!-- Don't have account link -->
      <div class="flex justify-center py-4 text-sm">
        <UButton
          variant="link"
          color="secondary"
          size="sm"
          @click="setSelectedForm(AuthForms.REGISTRATION)"
        >
          {{ $t("registration.createAccount") }}
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
          {{ $t("login.title") }}
        </h2>

        <!-- Google Login Button -->
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
          @click="googleLogin"
        >
          <template #leading>
            <UIcon name="i-mdi-google" class="size-5" />
          </template>
          {{ $t("login.continueWithGoogle") }}
        </UButton>

        <!-- Facebook Login Button -->
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
          @click="facebookLogin"
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

        <!-- Login Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- Email Field -->
          <UFormField
            :label="$t('login.formLabels.email')"
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
            :label="$t('login.formLabels.password')"
            name="password"
          >
            <UInput
              v-model="state.password"
              size="xl"
              autocomplete="current-password"
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
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <UButton
              variant="link"
              color="secondary"
              size="sm"
              @click="setSelectedForm(AuthForms.REQUEST_PASSWORD_RESET)"
            >
              {{ $t("login.forgotPassword") }}
            </UButton>
          </div>

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
            {{ $t('login.signIn') }}
          </UButton>

          <!-- Error Message -->
          <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
            {{ errorMessage }}
          </p>
        </UForm>
      </UCardBody>

      <!-- Don't have account link -->
      <div class="flex justify-center py-4 text-sm">
        <UButton
          variant="link"
          color="secondary"
          size="sm"
          @click="setSelectedForm(AuthForms.REGISTRATION)"
        >
          {{ $t("registration.createAccount") }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { useAuthStore, AuthForms } from "~/store/authStore";
import { useUiStore } from "~/store/ui.store";

const { t } = useI18n();
const { setSelectedForm } = useAuthStore();

const showPassword = ref(false)

// Validation schema
const schema = object({
  email: string()
    .email(t("login.validationMessages.incorrectEmailFormat"))
    .required(t("login.validationMessages.emailRequired")),
  password: string().required(t("login.validationMessages.passwordRequired")),
});

type Schema = InferType<typeof schema>;

// Form state with proper types
const state = reactive({
  email: "",
  password: "",
}) as { email: string; password: string };

const loading = ref(false);
const errorMessage = ref("");

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMessage.value = "";
  
  try {
    // Show the splash screen during login
    const uiStore = useUiStore();
    uiStore.setSplashVisible(true);
    
    await schema.validate(state);
    
    if (!state.email || !state.password) return;
    
    // Mock login instead of API call
    // This simulates a successful login
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate longer network delay for splash effect
    
    // Create a proper mock JWT token with header.payload.signature format
    // The payload needs to include all the required fields for our user
    const now = Math.floor(Date.now() / 1000);
    const email = state.email as string || '';
    const displayName = email && email.includes('@') ? email.split('@')[0] : 'User';
    
    const payload = {
      sub: "1", // subject (user id)
      name: displayName,
      email: email,
      role: "user",
      isActive: true,
      isVerified: true,
      provider: "local",
      iat: now,              // issued at time (now)
      exp: now + 3600 * 24   // expiration time (24 hours from now)
    };
    
    // Create a mock JWT token with correct structure (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const encodedPayload = btoa(JSON.stringify(payload));
    const mockToken = `${header}.${encodedPayload}.mock-signature`;
    
    // Set up mock user object from the same payload
    const mockUser = {
      id: "1",
      name: payload.name,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
      isVerified: payload.isVerified,
      provider: payload.provider
    };
    
    // Update auth state directly instead of calling the service
    const authStore = useAuthStore();
    authStore.setToken(mockToken);
    authStore.setUser(mockUser);
    
    // Show translated toast notification using i18n
    useToast().add({
      color: 'success',
      title: t('login.successTitle'),
      description: t('login.successMessage')
    });
    
    // Hide splash screen after login completes
    uiStore.setSplashVisible(false);
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error.message || t("login.validationMessages.loginFailed");
    
    // Hide splash screen on error
    const uiStore = useUiStore();
    uiStore.setSplashVisible(false);
    
    // Show translated error toast
    useToast().add({
      color: 'error',
      title: t('login.errorTitle'),
      description: t('login.errorMessage')
    });
  } finally {
    loading.value = false;
  }
}

// Social login handlers
const googleLogin = () => {
  useAuthService().initGoogleLoginFlow();
};

const facebookLogin = () => {
  useAuthService().initFacebookLoginFlow();
};

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
