// Property Media Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import { useNuxtApp } from "#app";

// Import types from models
import type {
  PropertyMedia,
  PropertyMediaFormData,
  PropertyMediaApiResponse,
  MediaUploadResponse
} from "~/models/entities/property/property-media.model";

import { MediaType } from "~/models/entities/property/property-media.model";

// Re-export types for external use
export type {
  PropertyMedia,
  PropertyMediaFormData,
  PropertyMediaApiResponse,
  MediaUploadResponse
};

// Re-export enum
export { MediaType };

// Backend snake_case response to frontend camelCase model
const transformToCamelCase = <T>(data: any): T => {
  if (!data) return {} as T;
  
  if (Array.isArray(data)) {
    return data.map(item => transformToCamelCase<any>(item)) as unknown as T;
  }
  
  if (typeof data !== 'object' || data === null) {
    return data as T;
  }
  
  const transformed: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Special case mappings
    let mappedKey = camelKey;
    if (key === 'is_cover_image') {
      mappedKey = 'isCoverImage';
    } else if (key === 'thumbnail_url') {
      mappedKey = 'thumbnailUrl';
    } else if (key === 'display_order') {
      mappedKey = 'displayOrder';
    } else if (key === 'created_at') {
      mappedKey = 'createdAt';
    } else if (key === 'file_size') {
      mappedKey = 'fileSize';
    } else if (key === 'file_name') {
      mappedKey = 'fileName';
    } else if (key === 'mime_type') {
      mappedKey = 'mimeType';
    }
    
    // Recursively convert nested objects
    transformed[mappedKey] = typeof value === 'object' && value !== null 
      ? transformToCamelCase(value)
      : value;
  });
  
  return transformed as T;
};

// Helper to get endpoints from the plugin
const getEndpoints = () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$endpoints.properties;
};

// Helper for HTTP instance using the useHttp composable
const getHttp = () => useHttp().http;

// Get toast and i18n - with proper error handling for Composition API
const getToast = () => {
  try {
    return useToast();
  } catch (error) {
    // Return null if not in a valid composition context
    return null;
  }
};

const getI18n = () => {
  try {
    return useI18n();
  } catch (error) {
    // Return a fallback if not in a valid composition context
    return { t: (key: string) => key };
  }
};

// Utility function to safely show toast notifications
const showToast = (id: string, title: string, description: string, color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral') => {
  const toast = getToast();
  if (toast) {
    toast.add({
      id,
      title,
      description,
      color
    });
  }
};

/**
 * Transform camelCase keys to snake_case for backend compatibility
 */
const transformToSnakeCase = (data: Record<string, any>): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Special case mappings
    if (key === 'isCoverImage') {
      transformed['is_cover_image'] = data[key];
    } else if (key === 'thumbnailUrl') {
      transformed['thumbnail_url'] = data[key];
    } else if (key === 'displayOrder') {
      transformed['display_order'] = data[key];
    } else if (key === 'propertyId') {
      transformed['property_id'] = data[key];
    } else {
      transformed[snakeKey] = data[key];
    }
  });
  
  return transformed;
};

/**
 * Get all media for a property
 */
export const fetchPropertyMedia = async (propertyId: string, type?: MediaType): Promise<PropertyMedia[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const url = type 
      ? `${endpoints.media(propertyId)}?type=${encodeURIComponent(type)}`
      : endpoints.media(propertyId);
      
    const response = await getHttp().get(url);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.media.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyMedia[]>(response.data.data || []);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.fetchError');
    showToast(
      'property-media-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching media for property ${propertyId}:`, error);
    return [];
  }
};

/**
 * Get a specific media item by ID
 */
export const fetchPropertyMediaById = async (mediaId: string): Promise<PropertyMedia | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.mediaDetail(mediaId));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.media.alerts.fetchMediaError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyMedia>(response.data.data || null);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.fetchMediaError');
    showToast(
      'property-media-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching property media ${mediaId}:`, error);
    return null;
  }
};

/**
 * Create a new media item
 */
export const createPropertyMedia = async (mediaData: PropertyMediaFormData): Promise<PropertyMedia | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the mediaData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(mediaData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyMediaApiResponse<PropertyMedia>>(
      endpoints.createMedia,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.createError'));
    }
    
    showToast(
      'property-media-created',
      t('success'),
      t('property.media.alerts.mediaCreated'),
      'success'
    );
    
    return transformToCamelCase<PropertyMedia>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.createError');
    showToast(
      'property-media-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating property media:", error);
    return null;
  }
};

/**
 * Update an existing media item
 */
export const updatePropertyMedia = async (mediaId: string, mediaData: Partial<PropertyMediaFormData>): Promise<PropertyMedia | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the mediaData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(mediaData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyMediaApiResponse<PropertyMedia>>(
      endpoints.updateMedia(mediaId),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.updateError'));
    }
    
    showToast(
      'property-media-updated',
      t('success'),
      t('property.media.alerts.mediaUpdated'),
      'success'
    );
    
    return transformToCamelCase<PropertyMedia>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.updateError');
    showToast(
      'property-media-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property media ${mediaId}:`, error);
    return null;
  }
};

/**
 * Delete a media item
 */
export const deletePropertyMedia = async (mediaId: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyMediaApiResponse<null>>(endpoints.deleteMedia(mediaId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.deleteError'));
    }
    
    showToast(
      'property-media-deleted',
      t('success'),
      t('property.media.alerts.mediaDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.deleteError');
    showToast(
      'property-media-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting property media ${mediaId}:`, error);
    return false;
  }
};

/**
 * Upload media for a property with progress tracking
 */
export const uploadPropertyMedia = async (
  propertyId: string, 
  formData: FormData, 
  onProgress?: (progress: number) => void
): Promise<PropertyMedia | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const http = getHttp();
    
    const response = await http.post<PropertyMediaApiResponse<PropertyMedia>>(
      endpoints.uploadMedia(propertyId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.uploadError'));
    }
    
    showToast(
      'property-media-uploaded',
      t('success'),
      t('property.media.alerts.mediaUploaded'),
      'success'
    );
    
    return transformToCamelCase<PropertyMedia>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.uploadError');
    showToast(
      'property-media-upload-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error uploading media for property ${propertyId}:`, error);
    return null;
  }
};

/**
 * Reorder media for a property
 */
export const reorderPropertyMedia = async (propertyId: string, mediaIds: string[]): Promise<PropertyMedia[] | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyMediaApiResponse<PropertyMedia[]>>(
      endpoints.reorderMedia(propertyId),
      { media_ids: mediaIds }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.reorderError'));
    }
    
    showToast(
      'property-media-reordered',
      t('success'),
      t('property.media.alerts.mediaReordered'),
      'success'
    );
    
    return transformToCamelCase<PropertyMedia[]>(response.data.data || []);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.reorderError');
    showToast(
      'property-media-reorder-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error reordering media for property ${propertyId}:`, error);
    return null;
  }
};

/**
 * Set media item as cover image
 */
export const setCoverImage = async (propertyId: string, mediaId: string): Promise<PropertyMedia | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyMediaApiResponse<PropertyMedia>>(
      endpoints.setCoverImage(propertyId),
      { media_id: mediaId }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.media.alerts.setCoverError'));
    }
    
    showToast(
      'property-cover-set',
      t('success'),
      t('property.media.alerts.coverImageSet'),
      'success'
    );
    
    return transformToCamelCase<PropertyMedia>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.media.alerts.setCoverError');
    showToast(
      'property-cover-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error setting cover image for property ${propertyId}:`, error);
    return null;
  }
};