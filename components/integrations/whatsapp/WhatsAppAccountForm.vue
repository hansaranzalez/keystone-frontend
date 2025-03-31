<template>
  <UForm :state="formData" class="rounded-lg border border-slate-200 dark:border-slate-800 p-3 sm:p-6 shadow-sm w-full max-w-full sm:max-w-2xl mx-auto bg-white dark:bg-slate-900" @submit="handleSubmit">
    <div class="space-y-4 sm:space-y-6">
      <!-- Account Name -->
      <UFormField
        :label="$t('integrations.whatsapp.form.name')"
        name="name"
        required
      >
        <UInput
          v-model="formData.name"
          :placeholder="$t('integrations.whatsapp.form.namePlaceholder')"
          :disabled="loading"
          size="xl"
          class="w-full h-12 sm:h-auto"
        >
          <template #leading>
            <UIcon
              name="i-heroicons-identification"
              class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
            />
          </template>
        </UInput>
        <template #error>
          <p v-if="errors.name" class="text-sm text-red-500 dark:text-red-400">{{ errors.name }}</p>
        </template>
      </UFormField>

      <!-- Phone Number -->
      <UFormField
        :label="$t('integrations.whatsapp.form.phoneNumber')"
        name="phoneNumber"
        required
      >
        <UInput
          v-model="formData.phoneNumber"
          type="tel"
          :placeholder="$t('integrations.whatsapp.form.phonePlaceholder')"
          :disabled="loading"
          size="xl"
          class="w-full h-12 sm:h-auto"
        >
          <template #leading>
            <UIcon
              name="i-heroicons-device-phone-mobile"
              class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
            />
          </template>
        </UInput>
        <template #hint>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.phoneHelp') }}</p>
        </template>
        <template #error>
          <p v-if="errors.phoneNumber" class="text-sm text-red-500 dark:text-red-400">{{ errors.phoneNumber }}</p>
        </template>
      </UFormField>

      <!-- Access Token -->
      <UFormField
        :label="$t('integrations.whatsapp.form.accessToken')"
        name="accessToken"
        required
      >
        <UInputGroup>
          <UInput
            v-model="formData.accessToken"
            :type="showToken ? 'text' : 'password'"
            :placeholder="$t('integrations.whatsapp.form.accessTokenPlaceholder')"
            :disabled="loading"
            size="xl"
            class="w-full h-12 sm:h-auto"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-key"
                class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
              />
            </template>
          </UInput>
          <template #trailing>
            <UButton
              color="neutral"
              variant="ghost"
              :icon="showToken ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              @click="toggleTokenVisibility"
              size="xs"
            />
          </template>
        </UInputGroup>
        <template #hint>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.accessTokenHelp') }}</p>
        </template>
        <template #error>
          <p v-if="errors.accessToken" class="text-sm text-red-500 dark:text-red-400">{{ errors.accessToken }}</p>
        </template>
      </UFormField>

      <!-- Business Account ID -->
      <UFormField
        :label="$t('integrations.whatsapp.form.businessAccountId')"
        name="businessAccountId"
        required
      >
        <UInput
          v-model="formData.businessAccountId"
          :placeholder="$t('integrations.whatsapp.form.businessAccountIdPlaceholder')"
          :disabled="loading"
          size="xl"
          class="w-full h-12 sm:h-auto"
        >
          <template #leading>
            <UIcon
              name="i-heroicons-building-office"
              class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
            />
          </template>
        </UInput>
        <template #hint>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.businessAccountIdHelp') }}</p>
        </template>
        <template #error>
          <p v-if="errors.businessAccountId" class="text-sm text-red-500 dark:text-red-400">{{ errors.businessAccountId }}</p>
        </template>
      </UFormField>

      <!-- Phone Number ID -->
      <UFormField
        :label="$t('integrations.whatsapp.form.phoneNumberId')"
        name="phoneNumberId"
        required
      >
        <UInput
          v-model="formData.phoneNumberId"
          :placeholder="$t('integrations.whatsapp.form.phoneNumberIdPlaceholder')"
          :disabled="loading"
          size="xl"
          class="w-full h-12 sm:h-auto"
        >
          <template #leading>
            <UIcon
              name="i-heroicons-hashtag"
              class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
            />
          </template>
        </UInput>
        <template #hint>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.phoneNumberIdHelp') }}</p>
        </template>
        <template #error>
          <p v-if="errors.phoneNumberId" class="text-sm text-red-500 dark:text-red-400">{{ errors.phoneNumberId }}</p>
        </template>
      </UFormField>

      <!-- Webhook Secret (Optional) -->
      <UFormField
        :label="$t('integrations.whatsapp.form.webhookSecret')"
        name="webhookSecret"
      >
        <UInputGroup>
          <UInput
            v-model="formData.webhookSecret"
            :type="showWebhookSecret ? 'text' : 'password'"
            :placeholder="$t('integrations.whatsapp.form.webhookSecretPlaceholder')"
            :disabled="loading"
            size="xl"
            class="w-full h-12 sm:h-auto"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-shield-check"
                class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
              />
            </template>
          </UInput>
          <template #trailing>
            <UButton
              color="neutral"
              variant="ghost"
              :icon="showWebhookSecret ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              @click="toggleWebhookSecretVisibility"
              size="xs"
            />
          </template>
        </UInputGroup>
        <template #hint>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('integrations.whatsapp.form.webhookSecretHelp') }}</p>
        </template>
      </UFormField>

      <!-- Business Name (Optional) -->
      <UFormField
        :label="$t('integrations.whatsapp.form.businessName')"
        name="businessName"
      >
        <UInput
          v-model="formData.businessName"
          :placeholder="$t('integrations.whatsapp.form.businessNamePlaceholder')"
          :disabled="loading"
          size="xl"
          class="w-full h-12 sm:h-auto"
        >
          <template #leading>
            <UIcon
              name="i-heroicons-building-storefront"
              class="text-slate-400 dark:text-slate-500 size-5 sm:size-5"
            />
          </template>
        </UInput>
      </UFormField>
    </div>

    <!-- Form Actions -->
    <div class="flex flex-col sm:flex-row w-full sm:justify-end gap-3 mt-6 sm:mt-8">
      <UButton
        type="button"
        color="neutral"
        variant="soft"
        size="lg"
        block
        class="sm:w-auto min-h-[46px]"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ $t('cancel') }}
      </UButton>
      <UButton
        type="submit"
        color="primary"
        variant="soft"
        size="lg"
        block
        class="sm:w-auto min-h-[46px]"
        :loading="loading"
        :disabled="loading || !isFormValid"
      >
        {{ isEditMode ? $t('integrations.whatsapp.form.update') : $t('integrations.whatsapp.form.connect') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormSubmitEvent } from '#ui/types';
import type { WhatsAppAccount, WhatsAppAccountFormData } from '~/services/whatsapp.service';

// Initialize i18n
const { t } = useI18n();

// Define component props
const props = defineProps<{
  account?: WhatsAppAccount;
  loading?: boolean;
  initialData?: Partial<WhatsAppAccountFormData>;
}>();

// Define component events
const emit = defineEmits<{
  (e: 'submit', formData: WhatsAppAccountFormData): void;
  (e: 'cancel'): void;
}>();

// Form data state
const formData = reactive<WhatsAppAccountFormData>({
  name: props.initialData?.name || props.account?.name || '',
  phoneNumber: props.initialData?.phoneNumber || props.account?.phoneNumber || '',
  accessToken: props.initialData?.accessToken || '',
  businessAccountId: props.initialData?.businessAccountId || '',
  phoneNumberId: props.initialData?.phoneNumberId || '',
  webhookSecret: props.initialData?.webhookSecret || '',
  businessName: props.initialData?.businessName || ''
});

// Form validation errors
const errors = reactive({
  name: '',
  phoneNumber: '',
  accessToken: '',
  businessAccountId: '',
  phoneNumberId: '',
  webhookSecret: '',
  businessName: ''
});

// Track password visibility states
const showToken = ref(false);
const showWebhookSecret = ref(false);

// Toggle visibility functions
function toggleTokenVisibility() {
  showToken.value = !showToken.value;
}

function toggleWebhookSecretVisibility() {
  showWebhookSecret.value = !showWebhookSecret.value;
}

// Form validation
const isFormValid = computed(() => {
  return (
    !!formData.name &&
    !!formData.phoneNumber &&
    !!formData.accessToken &&
    !!formData.businessAccountId &&
    !!formData.phoneNumberId
  );
});

// Detect if in edit mode (has account)
const isEditMode = computed(() => !!props.account);

// Update form when account prop changes
watch(() => props.account, (newAccount) => {
  if (newAccount) {
    formData.name = newAccount.name || formData.name;
    formData.phoneNumber = newAccount.phoneNumber || formData.phoneNumber;
  }
}, { immediate: true });

// Form submission handler
async function handleSubmit(event: FormSubmitEvent<typeof formData>) {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  // Basic validation
  let hasErrors = false;

  if (!formData.name) {
    errors.name = t('integrations.whatsapp.errors.nameRequired');
    hasErrors = true;
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = t('integrations.whatsapp.errors.phoneRequired');
    hasErrors = true;
  }

  if (!formData.phoneNumberId) {
    errors.phoneNumberId = t('integrations.whatsapp.errors.phoneNumberIdRequired');
    hasErrors = true;
  }

  if (!formData.businessAccountId) {
    errors.businessAccountId = t('integrations.whatsapp.errors.businessAccountIdRequired');
    hasErrors = true;
  }

  if (!formData.accessToken) {
    errors.accessToken = t('integrations.whatsapp.errors.accessTokenRequired');
    hasErrors = true;
  }

  if (hasErrors) return;

  // Emit submit event with form data
  emit('submit', {
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    phoneNumberId: formData.phoneNumberId,
    businessAccountId: formData.businessAccountId,
    accessToken: formData.accessToken,
    webhookSecret: formData.webhookSecret || undefined,
    businessName: formData.businessName || undefined
  });
}

</script>

<!-- No custom styles needed - using Tailwind utility classes -->
<style></style>
