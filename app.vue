<template>
  <UApp>
    <section v-if="!isAuthenticated">
      <AuthLogin v-if="selectedFormGetter === AuthForms.LOGIN" />
      <AuthRegistration v-if="selectedFormGetter === AuthForms.REGISTRATION" />
      <AuthRequestPasswordChange
        v-if="selectedFormGetter === AuthForms.REQUEST_PASSWORD_RESET"
      />
      <AuthChangePassword
        v-if="selectedFormGetter === AuthForms.RESET_PASSWORD"
      />
      <AuthActivatePasswordChange
        v-if="selectedFormGetter === AuthForms.ACTIVATE_PASSWORD_RESET"
      />
      <AuthPasswordChangeSuccess
        v-if="selectedFormGetter === AuthForms.PASSWORD_RESET_SUCCESS"
      />
      <AuthRequestPasswordChangeEmailSent
        v-if="selectedFormGetter === AuthForms.REQUEST_PASSWORD_RESET_SUCCESS"
      />
    </section>
    <section v-else>
      <UiHeader />
      <div class="pt-16 min-h-screen bg-gray-100 dark:bg-gray-900">
        <NuxtPage />
      </div>
    </section>
    <UNotifications />
    <UiSplash :is-visible="isSplashVisible" />
  </UApp>
</template>
<script lang="ts" setup>
/* <![CDATA[ */
import { storeToRefs } from "pinia";
import { useAuthStore, AuthForms } from "./store/authStore";
import { useUiStore } from "./store/ui.store";

const { isAuthenticated, selectedFormGetter } = storeToRefs(useAuthStore());
const { isSplashVisible } = storeToRefs(useUiStore());
/* ]]> */
</script>
