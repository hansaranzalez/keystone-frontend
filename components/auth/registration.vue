<template>
    <div class="min-h-screen flex flex-col space-y-5 items-center justify-center bg-gray-900">
        <h1 class="text-2xl font-normal text-center mb-6">
            {{ $t('registration.title') }}
        </h1>
        <UCard class="w-full max-w-md p-6">
            <UCardBody>
                <div class="space-y-6">
                    <div class="space-y-5 flex flex-col items-center justify-center pt-3">
                        <UButton size="xl" color="red" icon="mdi-google" :label="$t('login.continueWithGoogle')" @click="googleSignup" block />
                        <!-- <UButton size="xl" color="indigo" icon="mdi-facebook" :label="$t('registration.registrationWithFacebook')"
                            @click="facebookSignup" block /> -->
                        <!-- Error Message -->
                        <p v-if="errorMessage" class="text-red-500 text-center mt-6">
                            {{ errorMessage }}
                        </p>
                    </div>
                    <UDivider :label="$t('common.or')" />
                    <!-- Registration Form -->
                    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
                        <UFormGroup :label="$t('registration.formLabels.name')" name="name" class="block">
                            <UInput size="xl" v-model="state.name" type="text" placeholder="Enter your name" class="mt-2" />
                        </UFormGroup>

                        <UFormGroup :label="$t('registration.formLabels.email')" name="email" class="block">
                            <UInput size="xl" v-model="state.email" type="email" placeholder="Enter your email" class="mt-2" />
                        </UFormGroup>

                        <UFormGroup :label="$t('registration.formLabels.password')" name="password" class="block">
                            <UInput size="xl" v-model="state.password" type="password" placeholder="Enter your password"
                                class="mt-2" />
                        </UFormGroup>

                        <UFormGroup :label="$t('registration.formLabels.confirmPassword')" name="confirmPassword" class="block">
                            <UInput size="xl" v-model="state.confirmPassword" type="password" placeholder="Confirm your password"
                                class="mt-2" />
                        </UFormGroup>

                        <UButton type="submit" color="gray" :loading="loading" block size="xl">
                            {{ $t('registration.signUp') }}
                        </UButton>
                    </UForm>

                   
                    
                </div>
            </UCardBody>
        </UCard>
        <UCard class="w-full max-w-md px-6" :ui="{ base: 'border-none' }">
            <UCardFooter>
                <!-- Already Have Account -->
                <UButton @click="setSelectedForm(AuthForms.LOGIN)" :label="$t('registration.haveAccount')" size="xl" variant="link" color="primary" />
            </UCardFooter>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "~/composables/useServices";
import { useAuthStore, AuthForms } from "~/store/authStore";

const { t } = useI18n();
const { setSelectedForm } = useAuthStore();

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

// Form state
const state = reactive({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
});

const loading = ref(false);
const errorMessage = ref("");

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true;
    errorMessage.value = "";
    await schema.validate(state);
    if (!state.name || !state.email || !state.password || !state.confirmPassword) return;

    try {
        await useAuthService().register(state.name, state.email, state.password);
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.response.data.message || "Registration failed";
    } finally {
        loading.value = false;
    }
}

// Social signup handlers
const googleSignup = () => alert("Google signup clicked!");
const facebookSignup = () => alert("Facebook signup clicked!");
</script>
