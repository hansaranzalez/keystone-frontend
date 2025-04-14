// plugins/endpoints.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiBaseUrl = `${config.public.apiUrl}`;
  const endpoints = {
    login: `${apiBaseUrl}/auth/login`,
    googleLogin: `${apiBaseUrl}/auth/google/init-login-flow`,
    googleGetUserDetailsFromToken: (token: string) =>
      `${apiBaseUrl}/auth/google/get-user-details-from-token/${token}`,
    googleCallback: (code: string) =>
      `${apiBaseUrl}/auth/google/callback?code=${code}`,
    facebookLogin: `${apiBaseUrl}/auth/facebook/init-login-flow`,
    facebookExchangeToken: `${apiBaseUrl}/auth/facebook/exchange-token`, // For exchanging short-lived token for long-lived token
    facebookGetUserDetailsFromToken: (token: string) =>
      `${apiBaseUrl}/auth/facebook/get-user-details-from-token/${token}`,
    facebookCallback: (code: string, state: string) =>
      `${apiBaseUrl}/auth/facebook/callback?code=${code}&state=${state}`,
    facebookPrepareState: `${apiBaseUrl}/auth/facebook/prepare`,
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
      conversation: (id: string) =>
        `${apiBaseUrl}/messages/conversations/${id}`,
      messages: (conversationId: string) =>
        `${apiBaseUrl}/messages/conversations/${conversationId}/messages`,
      sendMessage: (conversationId: string) =>
        `${apiBaseUrl}/messages/conversations/${conversationId}/messages`,
    },

    // WhatsApp Integration
    whatsapp: {
      // Account Management
      accounts: `${apiBaseUrl}/whatsapp`,
      account: (id: string) => `${apiBaseUrl}/whatsapp/${id}`,
      verifyAccount: (id: string) => `${apiBaseUrl}/whatsapp/${id}/verify`,
      deactivateAccount: (id: string) =>
        `${apiBaseUrl}/whatsapp/${id}/deactivate`,
      reactivateAccount: (id: string) =>
        `${apiBaseUrl}/whatsapp/${id}/reactivate`,

      // Conversation Management
      conversations: `${apiBaseUrl}/whatsapp/conversations`,
      conversation: (id: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${id}`,
      markAsRead: (id: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${id}/read`,
      archive: (id: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${id}/archive`,
      unarchive: (id: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${id}/unarchive`,

      // Messaging
      messages: (conversationId: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages`,
      sendTextMessage: (conversationId: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/text`,
      sendMediaMessage: (conversationId: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/media`,
      sendTemplateMessage: (conversationId: string) =>
        `${apiBaseUrl}/whatsapp/conversations/${conversationId}/messages/template`,

      // Templates
      templates: `${apiBaseUrl}/whatsapp/templates`,
      template: (id: string) => `${apiBaseUrl}/whatsapp/templates/${id}`,
    },
    // Property Management Module
    properties: {
      // Public Endpoints
      search: `${apiBaseUrl}/properties/search`,
      public: `${apiBaseUrl}/properties/public`,
      publicDetail: (id: string) => `${apiBaseUrl}/properties/public/${id}`,

      // Property CRUD
      all: `${apiBaseUrl}/properties`,
      detail: (id: string) => `${apiBaseUrl}/properties/${id}`,
      create: `${apiBaseUrl}/properties`,
      createComplete: `${apiBaseUrl}/properties/complete`,
      update: (id: string) => `${apiBaseUrl}/properties/${id}`,
      updateComplete: (id: string) => `${apiBaseUrl}/properties/${id}/complete`,
      delete: (id: string) => `${apiBaseUrl}/properties/${id}`,
      deleteComplete: (id: string) => `${apiBaseUrl}/properties/${id}/complete`,

      // Property Status & Features
      updateStatus: (id: string) => `${apiBaseUrl}/properties/${id}/status`,
      toggleFeatured: (id: string) => `${apiBaseUrl}/properties/${id}/featured`,

      // Locations
      locations: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/locations`,
      locationDetail: (id: string) =>
        `${apiBaseUrl}/properties/locations/${id}`,
      createLocation: `${apiBaseUrl}/properties/locations`,
      updateLocation: (id: string) =>
        `${apiBaseUrl}/properties/locations/${id}`,
      deleteLocation: (id: string) =>
        `${apiBaseUrl}/properties/locations/${id}`,

      // Media
      media: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/media`,
      mediaDetail: (id: string) => `${apiBaseUrl}/properties/media/${id}`,
      createMedia: `${apiBaseUrl}/properties/media`,
      updateMedia: (id: string) => `${apiBaseUrl}/properties/media/${id}`,
      deleteMedia: (id: string) => `${apiBaseUrl}/properties/media/${id}`,
      uploadMedia: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/media/upload`,
      reorderMedia: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/media/reorder`,
      setCoverImage: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/media/cover`,

      // Documents
      documents: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/documents`,
      documentDetail: (id: string) =>
        `${apiBaseUrl}/properties/documents/${id}`,
      createDocument: `${apiBaseUrl}/properties/documents`,
      updateDocument: (id: string) =>
        `${apiBaseUrl}/properties/documents/${id}`,
      deleteDocument: (id: string) =>
        `${apiBaseUrl}/properties/documents/${id}`,
      uploadDocument: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/documents/upload`,

      // Features
      features: `${apiBaseUrl}/properties/features`,
      featureDetail: (id: string) => `${apiBaseUrl}/properties/features/${id}`,
      createFeature: `${apiBaseUrl}/properties/features`,
      updateFeature: (id: string) => `${apiBaseUrl}/properties/features/${id}`,
      deleteFeature: (id: string) => `${apiBaseUrl}/properties/features/${id}`,

      // Property-Feature Associations
      propertyFeatures: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/features`,
      addFeaturesToProperty: (propertyId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/features`,
      removeFeatureFromProperty: (propertyId: string, featureId: string) =>
        `${apiBaseUrl}/properties/${propertyId}/features/${featureId}`,
    },
  };

  return {
    provide: {
      endpoints,
    },
  };
});
