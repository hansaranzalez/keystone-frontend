<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from "vue";
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useNuxtApp } from "#app";
import { useI18n } from "vue-i18n";
import { useToast } from "#ui/composables/useToast";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profile.store";
import { updateUserPassword } from "~/services/auth.service";

const profileStore = useProfileStore();
const { loading } = storeToRefs(profileStore);
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

// Typed translation function to match auth service's expected type
const tFn = (key: string, named?: Record<string, any>): string => {
  return named ? t(key, named) : t(key);
};

// Validation schema for profile update
const profileSchema = object({
  name: string().required(t("user.profile.validationMessages.nameRequired")),
  email: string()
    .email(t("user.profile.validationMessages.incorrectEmailFormat"))
    .required(t("user.profile.validationMessages.emailRequired")),
  // Include additional fields from state for type compatibility
  profile_image: object().nullable(),
  profile_image_url: string().nullable(),
  is_active: string(),
  is_verified: string().nullable(),
  google_auth: string().nullable(),
  facebook_auth: string().nullable(),
  last_login: object().nullable(),
});

// Validation schema for password change
const passwordSchema = object({
  currentPassword: string().required(t("user.profile.validationMessages.currentPasswordRequired")),
  newPassword: string()
    .required(t("user.profile.validationMessages.newPasswordRequired"))
    .min(8, t("user.profile.validationMessages.passwordMin"))
    .matches(/[A-Z]/, t("user.profile.validationMessages.passwordUppercase"))
    .matches(/[a-z]/, t("user.profile.validationMessages.passwordLowercase"))
    .matches(/[0-9]/, t("user.profile.validationMessages.passwordNumber"))
    .matches(/[^A-Za-z0-9]/, t("user.profile.validationMessages.passwordSpecial")),
  confirmNewPassword: string()
    .required(t("user.profile.validationMessages.confirmPasswordRequired"))
    .oneOf([yupRef("newPassword")], t("user.profile.validationMessages.passwordMatch")),
});

// Define the type for the password schema
type PasswordSchema = InferType<typeof passwordSchema>;

// Form validation state - no longer needed with UForm but kept for backwards compatibility
const passwordErrors = ref<Record<string, string>>({});
const touchedFields = ref<Set<string>>(new Set());

// Password strength evaluation
const passwordStrength = ref(0);

// These validation functions are no longer needed with UForm
const strengthLabels = [
  { value: 0, label: t('user.profile.password.strengthLabels.weak'), color: 'danger' },
  { value: 1, label: t('user.profile.password.strengthLabels.fair'), color: 'warning' },
  { value: 2, label: t('user.profile.password.strengthLabels.good'), color: 'info' },
  { value: 3, label: t('user.profile.password.strengthLabels.strong'), color: 'success' }
];

const getCurrentStrengthLabel = computed(() => {
  return strengthLabels.find(s => s.value === passwordStrength.value) || strengthLabels[0];
});

// Form state
const state = reactive({
  name: "",
  email: "",
  profile_image: null as {
    id?: string;
    name: string;
    url: string;
    key: string;
  } | null,
  profile_image_url: null as string | null, // Keep for backward compatibility
  is_active: "ACTIVE",
  is_verified: false,
  google_auth: false,
  facebook_auth: false,
  last_login: null as Date | null,
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

// Evaluate password strength
function evaluatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check (minimum 8 characters)
  if (password.length >= 8) strength += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1; // Upper and lowercase
  if (/[0-9]/.test(password)) strength += 0.5; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) strength += 0.5; // Special characters
  
  // Return integer strength value 0-3
  return Math.min(3, Math.floor(strength));
}

// Function to compute password strength - called directly from the UInput
function computePasswordStrength() {
  // Using a short timeout ensures the UI updates properly
  setTimeout(() => {
    passwordStrength.value = evaluatePasswordStrength(state.newPassword || '');
  }, 10);
}

// Watch for password changes to update strength meter
watch(() => state.newPassword, (newValue) => {
  passwordStrength.value = evaluatePasswordStrength(newValue || '');
}, { immediate: true });

const errorMessage = ref("");
const isSubmitting = ref(false);
const isChangingPassword = ref(false);
// Password guidance text
const passwordGuidance = {
  intro: 'user.profile.password.guidanceIntro',
  length: 'user.profile.password.guidanceLength',
  mix: 'user.profile.password.guidanceMix',
  unique: 'user.profile.password.guidanceUnique'
};

// Format date helper
const formatDate = (date: Date | null) => {
  if (!date) return t("system.common.never");
  return new Date(date).toLocaleDateString();
};

// Profile image computed property with fallback
const profileImageUrl = computed(() => {
  return state.profile_image?.url || state.profile_image_url || '/default-avatar.png';
});

// Handle image upload
const handleImageUpload = () => {
  // Future implementation for image upload logic
  toast.add({
    color: 'info',
    title: t('system.common.comingSoon'),
    description: t('user.profile.photoUploadComingSoon')
  });
};

// Accordion item for password change
const accordionItems = [
  {
    label: t("user.profile.password.changePassword"),
    slot: "password",
    icon: "i-lucide-key",
    description: t("user.profile.password.lastChanged") + ": " + formatDate(new Date()),
  },
];

// Submit profile update
async function onProfileUpdate() {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await profileSchema.validate({
      name: state.name,
      email: state.email,
      profile_image: state.profile_image,
      profile_image_url: state.profile_image_url,
      is_active: state.is_active,
      is_verified: state.is_verified,
      google_auth: state.google_auth,
      facebook_auth: state.facebook_auth,
      last_login: state.last_login,
    });
    
    // Profile update implementation
    // For now just mock a success message
    toast.add({
      color: 'success',
      title: t('system.common.success'),
      description: t('user.profile.updateSuccess')
    });
    
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.message || t("user.profile.updateFailed");
    toast.add({
      color: 'error',
      title: t('system.common.error'),
      description: errorMessage.value
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Submit password change
async function onPasswordChange(event: FormSubmitEvent<PasswordSchema>) {
  isChangingPassword.value = true;
  errorMessage.value = "";
  
  // UForm has already validated the data at this point
  // Since the event was triggered, we know validation passed
  
  try {
    // Call service to change password using the functional approach from auth service
    // This matches the memory that auth.service was refactored to functional programming pattern
    const response = await updateUserPassword(
      state.currentPassword,
      state.newPassword,
      tFn
    );
    
    toast.add({
      color: 'success',
      title: t('system.common.success'),
      description: t('user.profile.notifications.passwordChangeSuccess'),
    });
    
    // Clear form fields
    state.currentPassword = "";
    state.newPassword = "";
    state.confirmNewPassword = "";
    
    // Reset validation state
    passwordErrors.value = {};
    touchedFields.value.clear();
    passwordStrength.value = 0;
  } catch (error: any) {
    console.error(error);
    // Store error message for potential UI display, but don't show another toast
    // since the auth service already handles displaying the error toast
    errorMessage.value = error.message || t('system.common.somethingWentWrong');
  } finally {
    isChangingPassword.value = false;
  }
}

// Get profile service
const getProfileService = () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$profileService;
};

// Load user data
onMounted(async () => {
  loading.value = true;
  try {
    const result = await getProfileService().getUserProfile();
    if (result.status !== 200) {
      toast.add({
        color: 'error',
        title: t('system.common.error'),
        description: t('user.profile.loadError')
      });
      return;
    }
    
    const user = result.data.output;
    state.name = user.name;
    state.email = user.email;
    state.profile_image = user.profile_image;
    // Handle backward compatibility
    state.profile_image_url = user.profile_image?.url || user.profile_image_url;
    state.is_active = user.is_active || 'ACTIVE';
    state.is_verified = user.is_verified || false;
    state.last_login = user.last_login || null;
    state.google_auth = user.google_auth || false;
    state.facebook_auth = user.facebook_auth || false;
  } catch (error) {
    console.error("Failed to load user data:", error);
    toast.add({
      color: 'error',
      title: t('system.common.error'),
      description: t('user.profile.loadError')
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.accordion-custom :deep(.un-accordion-wrapper) {
  border-radius: 0.5rem; /* rounded-lg */
  border-width: 0; /* border-0 */
  background-color: white; /* bg-white */
}

.dark .accordion-custom :deep(.un-accordion-wrapper) {
  background-color: rgb(30, 41, 59); /* dark:bg-slate-800 */
}

.accordion-custom :deep(.un-accordion-item) {
  border-radius: 0.375rem; /* rounded-md */
  margin-bottom: 0.75rem; /* mb-3 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  background-color: white; /* bg-white */
  padding: 0; /* p-0 */
}

.dark .accordion-custom :deep(.un-accordion-item) {
  background-color: rgb(30, 41, 59); /* dark:bg-slate-800 */
}

.accordion-custom :deep(.un-accordion-item-heading) {
  width: 100%; /* w-full */
  padding: 0.75rem 1rem; /* py-3 px-4 */
  border-top-left-radius: 0.5rem; /* rounded-t-lg */
  border-top-right-radius: 0.5rem; /* rounded-t-lg */
}

.accordion-custom :deep(.un-accordion-item-button) {
  width: 100%; /* w-full */
  display: flex; /* flex */
  justify-content: space-between; /* justify-between */
  align-items: center; /* items-center */
}

.accordion-custom :deep(.un-accordion-item-button-active) {
  color: rgb(59, 130, 246); /* text-primary-500 */
  font-weight: 500; /* font-medium */
}

.dark .accordion-custom :deep(.un-accordion-item-button-active) {
  color: rgb(96, 165, 250); /* dark:text-primary-400 */
}

.accordion-custom :deep(.un-accordion-item-content) {
  font-size: 0.875rem; /* text-sm */
  border-top-width: 1px; /* border-t */
  border-color: rgb(226, 232, 240); /* border-slate-200 */
  border-bottom-left-radius: 0.5rem; /* rounded-b-lg */
  border-bottom-right-radius: 0.5rem; /* rounded-b-lg */
  padding: 0.75rem 1rem 1rem 1rem; /* px-4 pb-4 pt-3 */
  background-color: rgb(248, 250, 252); /* bg-slate-50 */
}

.dark .accordion-custom :deep(.un-accordion-item-content) {
  border-color: rgb(51, 65, 85); /* dark:border-slate-700 */
  background-color: rgba(30, 41, 59, 0.5); /* dark:bg-slate-800/50 */
}
</style>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="text-2xl md:text-3xl font-medium text-center mb-8">
      {{ $t("user.profile.title") }}
    </h1>

    <div class="relative">
      <UiSplash :isVisible="loading" :loadingText="$t('system.common.loading')" />
      
      <!-- Profile Content -->
      <div class="space-y-8">
        <!-- Profile Image Section -->
        <div class="flex flex-col items-center space-y-4">
          <div class="relative group">
            <img
              :src="profileImageUrl"
              class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-700 transition-all duration-300 group-hover:opacity-75"
              :alt="state.profile_image?.name || state.name || $t('user.profile')"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UButton
                size="md"
                color="primary"
                variant="solid"
                icon="i-lucide-camera"
                class="rounded-full p-2 shadow-lg"
                @click="handleImageUpload"
                :aria-label="$t('user.profile.updatePhoto')"
              />
            </div>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">{{ state.name }}</p>
          <UButton
            size="md"
            color="primary"
            variant="ghost"
            icon="i-lucide-camera"
            :label="$t('user.profile.updatePhoto')"
            @click="handleImageUpload"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Profile Information -->
          <div class="col-span-1 lg:col-span-2 space-y-6">
            <!-- Basic Information -->
            <UCard class="w-full shadow-sm">
              <UCardTitle class="text-lg font-medium border-b border-slate-200 dark:border-slate-700 pb-3">
                {{ $t('user.profile.basicInfo') }}
              </UCardTitle>
              <UCardBody class="pt-4">
                <form @submit.prevent="onProfileUpdate">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormGroup
                      :label="$t('user.profile.formLabels.name')"
                      name="name"
                    >
                      <UInput
                        v-model="state.name"
                        type="text"
                        :placeholder="$t('user.profile.placeholders.name')"
                        size="xl"
                        class="focus:ring-2 focus:ring-primary-500/20"
                      />
                    </UFormGroup>

                    <UFormGroup
                      :label="$t('user.profile.formLabels.email')"
                      name="email"
                    >
                      <UInput
                        v-model="state.email"
                        type="email"
                        :placeholder="$t('user.profile.placeholders.email')"
                        :disabled="state.google_auth || state.facebook_auth"
                        size="xl"
                        class="focus:ring-2 focus:ring-primary-500/20"
                      />
                    </UFormGroup>
                  </div>
                  
                  <div class="mt-6 flex justify-end">
                    <UButton
                      type="submit"
                      color="primary"
                      :loading="isSubmitting"
                      :disabled="isSubmitting"
                      size="xl"
                      icon="i-lucide-save"
                    >
                      {{ $t("user.profile.saveChanges") }}
                    </UButton>
                  </div>
                </form>
              </UCardBody>
            </UCard>

            <!-- Password Change Section -->
            <UCard class="w-full shadow-sm">
              <UCardTitle class="text-lg font-medium border-b border-slate-200 dark:border-slate-700 pb-3">
                {{ $t('user.profile.security') }}
              </UCardTitle>
              <UCardBody class="pt-4">
                <UForm
                  :schema="passwordSchema"
                  :state="state"
                  class="space-y-6 p-1"
                  @submit="onPasswordChange"
                >
                  <div class="mb-4">
                    <p class="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      {{ $t('user.profile.password.guidanceIntro') }}
                    </p>
                    <ul class="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 space-y-1 ml-2">
                      <li>{{ $t('user.profile.password.guidanceLength') }}</li>
                      <li>{{ $t('user.profile.password.guidanceMix') }}</li>
                      <li>{{ $t('user.profile.password.guidanceUnique') }}</li>
                    </ul>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField
                      :label="$t('user.profile.password.current')"
                      name="currentPassword"
                      required
                      class="md:col-span-2"
                    >
                      <UInput
                        v-model="state.currentPassword"
                        type="password"
                        :placeholder="$t('user.profile.password.currentPlaceholder')"
                        autocomplete="current-password"
                        size="xl"
                        class="focus:ring-2 focus:ring-primary-500/20"
                      />
                    </UFormField>
                    
                    <UFormField
                      :label="$t('user.profile.password.new')"
                      name="newPassword"
                      required
                      :help="$t('user.profile.password.newHelp')"
                    >
                      <UInput
                        v-model="state.newPassword"
                        type="password"
                        :placeholder="$t('user.profile.password.newPlaceholder')"
                        autocomplete="new-password"
                        aria-describedby="password-requirements"
                        size="xl"
                        class="focus:ring-2 focus:ring-primary-500/20"
                        @update:model-value="computePasswordStrength"
                        @input="computePasswordStrength"
                      />
                      <!-- Password strength meter -->
                      <div class="mt-2">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-slate-500 dark:text-slate-400">
                            {{ $t('user.profile.password.strength') }}:
                          </span>
                          <span class="text-xs" :class="`text-${getCurrentStrengthLabel.color}-500`">
                            {{ $t(getCurrentStrengthLabel.label) }}
                          </span>
                        </div>
                        <UProgress 
                          v-model="passwordStrength" 
                          :max="3"
                          :color="passwordStrength === 0 ? 'error' :
                                  passwordStrength === 1 ? 'warning' :
                                  passwordStrength === 2 ? 'info' :
                                  'success'"
                        />
                      </div>
                    </UFormField>
                    
                    <UFormField
                      :label="$t('user.profile.password.confirm')"
                      name="confirmNewPassword"
                      required
                      :help="$t('user.profile.password.confirmHelp')"
                    >
                      <UInput
                        v-model="state.confirmNewPassword"
                        type="password"
                        :placeholder="$t('user.profile.password.newPlaceholder')"
                        autocomplete="new-password"
                        aria-describedby="password-requirements"
                        size="xl"
                        class="focus:ring-2 focus:ring-primary-500/20"
                      />
                    </UFormField>
                  </div>
                  
                  <div class="flex justify-end pt-2">
                    <UButton
                      type="submit"
                      color="primary"
                      :loading="isChangingPassword"
                      :disabled="isChangingPassword"
                      size="xl"
                      icon="i-lucide-key"
                    >
                      {{ $t("user.profile.password.update") }}
                    </UButton>
                  </div>
                </UForm>
              </UCardBody>
            </UCard>
          </div>
          
          <!-- Right Column - Status Information -->
          <div class="col-span-1 space-y-6">
            <!-- Authentication Status -->
            <UCard class="w-full shadow-sm">
              <UCardTitle class="text-lg font-medium border-b border-slate-200 dark:border-slate-700 pb-3">
                {{ $t("user.profile.authentication.title") }}
              </UCardTitle>
              <UCardBody class="pt-4">
                <ul class="space-y-4">
                  <li class="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-mail-check" class="text-slate-500 dark:text-slate-400" />
                      <span>{{ $t("user.profile.authentication.emailVerified") }}</span>
                    </div>
                    <UBadge :color="state.is_verified ? 'success' : 'warning'" size="xl">
                      {{ state.is_verified ? $t("system.common.yes") : $t("common.no") }}
                    </UBadge>
                  </li>
                  <li class="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-google" class="text-slate-500 dark:text-slate-400" />
                      <span>Google</span>
                    </div>
                    <UBadge :color="state.google_auth ? 'success' : 'neutral'" size="xl">
                      {{ state.google_auth ? $t("system.common.connected") : $t("common.notConnected") }}
                    </UBadge>
                  </li>
                  <li class="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-facebook" class="text-slate-500 dark:text-slate-400" />
                      <span>Facebook</span>
                    </div>
                    <UBadge :color="state.facebook_auth ? 'success' : 'neutral'" size="xl">
                      {{ state.facebook_auth ? $t("system.common.connected") : $t("system.common.notConnected") }}
                    </UBadge>
                  </li>
                </ul>
              </UCardBody>
            </UCard>

            <!-- Account Status -->
            <UCard class="w-full shadow-sm">
              <UCardTitle class="text-lg font-medium border-b border-slate-200 dark:border-slate-700 pb-3">
                {{ $t("user.profile.accountStatus.title") }}
              </UCardTitle>
              <UCardBody class="pt-4">
                <div class="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 mb-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UIcon 
                        :name="state.is_active === 'ACTIVE' ? 'i-lucide-check-circle' : 'i-lucide-alert-circle'" 
                        :class="state.is_active === 'ACTIVE' ? 'text-green-500' : 'text-red-500'" 
                        size="xl" 
                      />
                      <span>{{ $t("user.profile.accountStatus.status") }}</span>
                    </div>
                    <UBadge 
                      :color="state.is_active === 'ACTIVE' ? 'success' : 'error'" 
                      size="xl"
                      class="font-medium whitespace-nowrap px-3 py-1"
                    >
                      {{ state.is_active === 'ACTIVE' ? $t("user.profile.accountStatus.active") : $t("user.profile.accountStatus.inactive") }}
                    </UBadge>
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-4">
                  <UIcon name="i-lucide-clock" class="text-slate-500 dark:text-slate-400" />
                  <span class="text-sm text-slate-600 dark:text-slate-300">
                    {{ $t("user.profile.accountStatus.lastLogin") }}:
                    <span class="font-medium">{{ formatDate(state.last_login) }}</span>
                  </span>
                </div>
              </UCardBody>
            </UCard>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
