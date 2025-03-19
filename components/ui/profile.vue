<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, ref as yupRef } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { storeToRefs } from "pinia";
import { useProfileStore } from "~/store/profile.store";

const { loading } = storeToRefs(useProfileStore());

const { t } = useI18n();

// Validation schema
const schema = object({
  name: string().required(t("profile.validationMessages.nameRequired")),
  email: string()
    .email(t("profile.validationMessages.incorrectEmailFormat"))
    .required(t("profile.validationMessages.emailRequired")),
  currentPassword: string(),
  newPassword: string().min(8, t("profile.validationMessages.passwordMin")),
  confirmNewPassword: string().oneOf(
    [yupRef("newPassword")],
    t("profile.validationMessages.passwordMatch")
  ),
});

// Form state
const state = reactive({
  name: "",
  email: "",
  profile_image_url: null as string | null,
  is_active: "ACTIVE",
  is_verified: false,
  google_auth: false,
  facebook_auth: false,
  last_login: null as Date | null,
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const errorMessage = ref("");

// Password change section content

// Format date helper
const formatDate = (date: Date | null) => {
  if (!date) return t("common.never");
  return new Date(date).toLocaleDateString();
};

// Handle image upload
const handleImageUpload = () => {
  // Implement image upload logic
};

// handle accordion
const items = [
  {
    label: t("profile.password.changePassword"),
    slot: "content",
  },
];

// Submit handler
async function onSubmit(event: FormSubmitEvent<typeof schema>) {
  loading.value = true;
  errorMessage.value = "";

  try {
    await schema.validate(state);
    // Implement profile update logic here
    const authService = useAuthService();
    // Update profile logic
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.message || t("profile.updateFailed");
  } finally {
    loading.value = false;
  }
}

// Load user data
onMounted(async () => {
  try {
    const result = await useProfileService().getProfile();
    console.log(result);
    if (result.status !== 200) return;
    const user = result.data.output;
    state.name = user.name;
    state.email = user.email;
    state.profile_image_url = user.profile_image_url;
    state.is_active = user.is_active;
    state.is_verified = user.is_verified;
    state.last_login = user.last_login;
    state.google_auth = user.google_auth;
    state.facebook_auth = user.facebook_auth;
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
});
</script>

<template>
  <div
    class=" flex flex-col space-y-5 items-center justify-center"
  >
    <h1 class="text-2xl font-normal text-center mb-6">
      {{ $t("profile.title") }}
    </h1>

    <div class="relative">
      <UiSplash :isVisible="loading" loadingText="Cargando..." />
      <div class="space-y-6">
        <!-- Profile Image Section -->
        <div class="flex flex-col items-center space-y-4">
          <img
            :src="state.profile_image_url || '/default-avatar.png'"
            class="w-32 h-32 rounded-full object-cover"
            alt="Profile"
          />
          <UButton
            size="sm"
            color="gray"
            icon="i-heroicons-camera"
            :label="$t('profile.updatePhoto')"
            @click="handleImageUpload"
          />
        </div>

        <!-- Profile Form -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <div class="flex space-x-5">
            <div class="space-y-5">
              <UCard class="w-full max-w-2xl p-6">
                <UCardBody>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormGroup
                      :label="$t('profile.formLabels.name')"
                      name="name"
                      class="block"
                    >
                      <UInput
                        size="xl"
                        v-model="state.name"
                        type="text"
                        :placeholder="$t('profile.placeholders.name')"
                      />
                    </UFormGroup>

                    <UFormGroup
                      :label="$t('profile.formLabels.email')"
                      name="email"
                      class="block"
                    >
                      <UInput
                        size="xl"
                        v-model="state.email"
                        type="email"
                        :placeholder="$t('profile.placeholders.email')"
                        :disabled="state.google_auth || state.facebook_auth"
                      />
                    </UFormGroup>
                  </div>
                </UCardBody>
              </UCard>

              <!-- Password Change Section -->
              <UCard class="w-full max-w-2xl p-6">
                <UCardBody>
                  <div>
                    <UAccordion :items="items">
                      <template #content="{ item }">
                        <div class="space-y-5">
                          <UFormGroup
                            :label="$t('profile.password.current')"
                            name="currentPassword"
                          >
                            <UInput
                              v-model="state.currentPassword"
                              type="password"
                              size="xl"
                            />
                          </UFormGroup>
                          <UFormGroup
                            :label="$t('profile.password.new')"
                            name="newPassword"
                          >
                            <UInput
                              v-model="state.newPassword"
                              type="password"
                              size="xl"
                            />
                          </UFormGroup>
                          <UFormGroup
                            :label="$t('profile.password.confirm')"
                            name="confirmNewPassword"
                          >
                            <UInput
                              v-model="state.confirmNewPassword"
                              type="password"
                              size="xl"
                            />
                          </UFormGroup>
                        </div>
                      </template>
                    </UAccordion>
                  </div>
                </UCardBody>
              </UCard>

              <!-- Submit Button -->
              <UButton
                type="submit"
                color="gray"
                :loading="loading"
                block
                size="xl"
              >
                {{ $t("profile.saveChanges") }}
              </UButton>
            </div>

            <div class="space-y-5">
              <!-- Authentication Status -->
              <UCard class="w-full max-w-2xl p-6">
                <UCardBody>
                  <div >
                    <h3 class="font-medium mb-3">
                      {{ $t("profile.authentication.title") }}
                    </h3>
                    <div class="space-y-5">
                      <div class="flex items-center justify-between">
                        <span>{{
                          $t("profile.authentication.emailVerified")
                        }}</span>
                        <UBadge :color="state.is_verified ? 'green' : 'red'">
                          {{
                            state.is_verified
                              ? $t("common.yes")
                              : $t("common.no")
                          }}
                        </UBadge>
                      </div>
                      <div class="flex items-center justify-between">
                        <span>Google</span>
                        <UBadge :color="state.google_auth ? 'green' : 'gray'">
                          {{
                            state.google_auth
                              ? $t("common.connected")
                              : $t("common.notConnected")
                          }}
                        </UBadge>
                      </div>
                      <div class="flex items-center justify-between">
                        <span>Facebook</span>
                        <UBadge :color="state.facebook_auth ? 'green' : 'gray'">
                          {{
                            state.facebook_auth
                              ? $t("common.connected")
                              : $t("common.notConnected")
                          }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </UCardBody>
              </UCard>

              <!-- Account Status -->
              <UCard class="w-full max-w-2xl p-6">
                <UCardBody>
                  <div
                    class="flex items-center justify-between space-x-5"
                  >
                    <div>
                      <h3 class="font-medium">
                        {{ $t("profile.accountStatus.title") }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{ $t("profile.accountStatus.lastLogin") }}:
                        {{ formatDate(state.last_login) }}
                      </p>
                    </div>
                    <UBadge
                      :color="state.is_active === 'ACTIVE' ? 'green' : 'red'"
                    >
                      {{ state.is_active }}
                    </UBadge>
                  </div>
                </UCardBody>
              </UCard>

              <!-- Error Message -->
              <p v-if="errorMessage" class="text-red-500 text-center">
                {{ errorMessage }}
              </p>
            </div>
          </div>
          <!-- Basic Information -->
        </UForm>
      </div>
    </div>
  </div>
</template>
