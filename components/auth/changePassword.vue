<template>
    <div class="min-h-screen flex flex-col space-y-5 items-center justify-center bg-gray-900">
        <h1 class="text-2xl font-normal text-center mb-6">
            {{ $t('changePassword.title') }}
        </h1>
        <UCard class="w-full max-w-md p-6">
            <UCardBody>
                <div class="space-y-6">
                    <!-- Change Password Form -->
                    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
                        <UFormGroup :label="$t('changePassword.formLabels.newPassword')" name="newPassword" class="block">
                            <UInput
                                size="xl"
                                v-model="state.newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                class="mt-2"
                            />
                        </UFormGroup>

                        <UFormGroup :label="$t('changePassword.formLabels.confirmPassword')" name="confirmPassword" class="block">
                            <UInput
                                size="xl"
                                v-model="state.confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                class="mt-2"
                            />
                        </UFormGroup>

                        <UButton type="submit" color="gray" :loading="loading" block size="xl">
                            {{ $t('changePassword.submit') }}
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
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";

const { t } = useI18n();

// Validation schema
const schema = object({
    newPassword: string()
        .min(8, t('changePassword.validationMessages.passwordMin'))
        .required(t('changePassword.validationMessages.passwordRequired')),
    confirmPassword: string()
        .oneOf([yupRef('newPassword')], t('changePassword.validationMessages.passwordMatch'))
        .required(t('changePassword.validationMessages.confirmPasswordRequired')),
});

type Schema = InferType<typeof schema>;

// Form state
const state = reactive({
    newPassword: undefined,
    confirmPassword: undefined,
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

    if (!state.newPassword || !state.confirmPassword) return;

    try {
        await useAuthService().changePassword(state.newPassword);
        successMessage.value = t('changePassword.successMessage');
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.response?.data?.message || t('changePassword.errorMessage');
    } finally {
        loading.value = false;
    }
}
</script>
