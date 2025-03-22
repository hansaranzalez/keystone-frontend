// services/profile.service.ts
import { useNuxtApp } from '#app';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '~/store/profile.store';
import { AuthUser, Role, Status } from '~/models/entities/AuthUser';
import type { ImageAsset } from '~/models/entities/ImageAsset';
import { useHttp } from '~/composables/useHttp';

interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  isActive: string;
  role: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  googleAuth: boolean;
  facebookAuth: boolean;
  profileImage: {
    url: string;
    name: string;
  } | null;
}

interface ProfileData {
  name: string;
  email: string;
  profile_image?: ImageAsset | null;
}

// Helper functions to get dependencies
const getHttp = () => {
  return useHttp().http;  // Using the same HTTP client as auth service
};

const getEndpoints = () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$endpoints;
};

const getStore = () => {
  return useProfileStore();
};

// Get user profile information from the backend
export const getUserProfile = async (): Promise<{ status: number; data: { output: AuthUser } }> => {
  const http = getHttp();
  const endpoints = getEndpoints();
  const store = getStore();
  const { t } = useI18n();
  
  store.setLoading(true);
  console.log('[ProfileService] Getting user profile from:', endpoints.getUserProfile);
  
  try {
    // Use the configured axios instance with proper auth headers
    console.log('[ProfileService] Attempting to fetch user profile...');
    
    const response = await http.get(endpoints.getUserProfile);
    
    console.log('[ProfileService] Response status:', response.status);
    console.log('[ProfileService] Response data:', response.data);
    
    if (response.status !== 200) {
      console.error('[ProfileService] Error response:', response.statusText);
      return {
        status: response.status,
        data: {
          output: {} as AuthUser
        }
      };
    }
    
    const data = response.data;
    console.log('[ProfileService] Parsed data:', data);

    
    // Transform the backend response to match our AuthUser model
    const userData = data;
    console.log('[ProfileService] Processing user data:', userData);
    
    // Prepare data for AuthUser.Build method
    const userDataForBuild = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      is_verified: userData.isVerified,
      is_active: userData.isActive as Status,
      role: userData.role as Role,
      last_login: userData.lastLogin,
      created_at: userData.createdAt,
      updated_at: userData.updatedAt,
      google_auth: userData.googleAuth,
      facebook_auth: userData.facebookAuth,
      profile_image: userData.profileImage ? {
        url: userData.profileImage.url,
        name: userData.profileImage.name,
      } : null,
      profile_image_url: userData.profileImage?.url || null,
      // Add default value for last_password_change if not present in response
      last_password_change: null
    };
    
    // Use the Build method to create an AuthUser instance with all properties
    const user = AuthUser.Build(userDataForBuild);
    
    return {
      status: 200,
      data: {
        output: user
      }
    };
  } catch (error) {
    console.error('[ProfileService] Error getting user profile:', error);
    return {
      status: 500,
      data: {
        output: {} as AuthUser
      }
    };
  } finally {
    store.setLoading(false);
  }
};

// Update user profile information
export const updateProfile = async (profileData: ProfileData): Promise<{ status: number; data: any }> => {
  const http = getHttp();
  const endpoints = getEndpoints();
  const store = getStore();
  
  store.setLoading(true);
  
  try {
    const response = await http.post(endpoints.updateProfile, profileData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('[ProfileService] Error updating profile:', error);
    return {
      status: 500,
      data: null
    };
  } finally {
    store.setLoading(false);
  }
};

// Initialize profile service
export const initProfileService = () => {
  // We'll only call this function from the plugin
  // This keeps the initialization in one place
};

// The profile service should be accessed via the plugin,
// which will provide these functions directly
// This matches the pattern used in auth.service.ts
