// plugins/endpoints.ts
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const apiBaseUrl = `${config.public.apiUrl}`
    const endpoints = {
        login: `${apiBaseUrl}/auth/login`,
        googleLogin: `${apiBaseUrl}/auth/google/init-login-flow`,
        googleGetUserDetailsFromToken: (token: string) => `${apiBaseUrl}/auth/google/get-user-details-from-token/${token}`,
        googleCallback: (code: string) => `${apiBaseUrl}/auth/google/callback?code=${code}`,
        facebookLogin: `${apiBaseUrl}/auth/facebook/init-login-flow`,
        facebookExchangeToken: `${apiBaseUrl}/auth/facebook/exchange-token`, // For exchanging short-lived token for long-lived token
        facebookGetUserDetailsFromToken: (token: string) => `${apiBaseUrl}/auth/facebook/get-user-details-from-token/${token}`,
        facebookCallback: (code: string) => `${apiBaseUrl}/auth/facebook/callback?code=${code}`,
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
        
        // Unified Inbox
        inbox: {
            // Conversations
            conversations: `${apiBaseUrl}/messages/conversations`,
            conversation: (id: string) => `${apiBaseUrl}/messages/conversations/${id}`,
            messages: (conversationId: string) => `${apiBaseUrl}/messages/conversations/${conversationId}/messages`,
            sendMessage: (conversationId: string) => `${apiBaseUrl}/messages/conversations/${conversationId}/messages`,
        },
        
        // WhatsApp Integration
        whatsapp: {
            // Account Management
            accounts: `${apiBaseUrl}/whatsapp`,
            account: (id: string) => `${apiBaseUrl}/whatsapp/${id}`,
            verifyAccount: (id: string) => `${apiBaseUrl}/whatsapp/${id}/verify`,
            deactivateAccount: (id: string) => `${apiBaseUrl}/whatsapp/${id}/deactivate`,
            reactivateAccount: (id: string) => `${apiBaseUrl}/whatsapp/${id}/reactivate`,
            
            // Conversation Management
            conversations: `${apiBaseUrl}/whatsapp/conversations`,
            conversation: (id: string) => `${apiBaseUrl}/whatsapp/conversations/${id}`,
            markAsRead: (id: string) => `${apiBaseUrl}/whatsapp/conversations/${id}/read`,
            archive: (id: string) => `${apiBaseUrl}/whatsapp/conversations/${id}/archive`,
            unarchive: (id: string) => `${apiBaseUrl}/whatsapp/conversations/${id}/unarchive`,
            
            // Messaging
            messages: (conversationId: string) => `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages`,
            sendTextMessage: (conversationId: string) => `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/text`,
            sendMediaMessage: (conversationId: string) => `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/media`,
            sendTemplateMessage: (conversationId: string) => `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/template`,
            
            // Templates
            templates: `${apiBaseUrl}/whatsapp/templates`,
            template: (id: string) => `${apiBaseUrl}/whatsapp/templates/${id}`
        }
    }
    
    return {
      provide: {
        endpoints
      }
    }
  })