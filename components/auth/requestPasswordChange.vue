<template>
    <div class="min-h-screen flex flex-col space-y-5 items-center justify-center bg-gray-900">
        <h1 class="text-2xl font-normal text-center mb-6">
            {{ $t('passwordChange.title') }}
        </h1>
        <UCard class="w-full max-w-md p-6">
            <UCardBody>
                <div class="space-y-6">
                    <!-- Password Change Request Form -->
                    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
                        <UFormGroup :label="$t('passwordChange.formLabels.email')" name="email" class="block">
                            <UInput size="xl" v-model="state.email" type="email" placeholder="Enter your email" class="mt-2" />
                        </UFormGroup>

                        <UButton type="submit" color="gray" :loading="loading" block size="xl">
                            {{ $t('passwordChange.request') }}
                        </UButton>
                    </UForm>

                    <!-- Success Message -->
                    <p v-if="successMessage" class="text-green-500 text-center mt-6">
                        {{ successMessage }}
                    </p>

                    <!-- Error Message -->
                    <p v-if="errorMessage" class="text-red-500 text-center mt-6">
                        {{ errorMessage }}
                    </p>
                </div>
            </UCardBody>
        </UCard>
        <UCard class="w-full max-w-md px-6" :ui="{ base: 'border-none' }">
            <UCardFooter>
                <UButton @click="setSelectedForm(AuthForms.LOGIN)" icon="material-symbols-arrow-back-ios-new" :label="$t('passwordChange.goBackToLogin')" size="xl" variant="link" color="primary" />
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
const { setSelectedForm, setCatchedEmail } = useAuthStore();

// Validation schema
const schema = object({
    email: string()
        .email(t('passwordChange.validationMessages.incorrectEmailFormat'))
        .required(t('passwordChange.validationMessages.emailRequired')),
});

type Schema = InferType<typeof schema>;

// Form state
const state = reactive({
    email: undefined,
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    await schema.validate(state);

    if (!state.email) return;

    try {
        await useAuthService().requestPasswordChange(state.email);
        successMessage.value = t('passwordChange.successMessage');
        setCatchedEmail(state.email);
        setSelectedForm(AuthForms.ACTIVATE_PASSWORD_RESET)
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.response.data.message || t('passwordChange.errorMessage');
    } finally {
        loading.value = false;
    }
}
</script>
