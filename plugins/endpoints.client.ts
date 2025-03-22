// plugins/endpoints.ts
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const apiBaseUrl = `${config.public.apiUrl}`
    const endpoints = {
        login: `${apiBaseUrl}/auth/login`,
        googleLogin: `${apiBaseUrl}/auth/google/init-login-flow`,
        googleGetUserDetailsFromToken: (token: string) => `${apiBaseUrl}/auth/google/get-user-details-from-token/${token}`,
        googleCallback: (code: string) => `${apiBaseUrl}/auth/google/callback?code=${code}`,
        register: `${apiBaseUrl}/auth/register`,
        requestPasswordChange: `${apiBaseUrl}/auth/request-password-change`,
        changePassword: `${apiBaseUrl}/auth/change-password`,
        verifyPasswordResetCode: `${apiBaseUrl}/auth/verify-password-reset-code`,
        verifyActivationCode: `${apiBaseUrl}/auth/verify-activation-code`,
        getUserProfile: `${apiBaseUrl}/auth/me`,
        updateProfile: `${apiBaseUrl}/auth/me`,
        updatePassword: `${apiBaseUrl}/auth/change-password-logged-in`,
        // API information
        version: `${apiBaseUrl}/version`,
    }
    
    return {
      provide: {
        endpoints
      }
    }
  })