// Property Feature Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import { useNuxtApp } from "#app";

// Import types from models
import type {
  PropertyFeature,
  PropertyFeatureFormData,
  PropertyFeatureApiResponse
} from "~/models/entities/property/property-feature.model";

// Re-export types for external use
export type {
  PropertyFeature,
  PropertyFeatureFormData,
  PropertyFeatureApiResponse
};

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
    if (key === 'is_highlighted') {
      mappedKey = 'isHighlighted';
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
    if (key === 'isHighlighted') {
      transformed['is_highlighted'] = data[key];
    } else {
      transformed[snakeKey] = data[key];
    }
  });
  
  return transformed;
};

/**
 * Get all property features
 */
export const fetchPropertyFeatures = async (category?: string): Promise<PropertyFeature[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const url = category 
      ? `${endpoints.features}?category=${encodeURIComponent(category)}`
      : endpoints.features;
      
    const response = await getHttp().get(url);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.features.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyFeature[]>(response.data.data || []);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.fetchError');
    showToast(
      'property-features-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error fetching property features:", error);
    return [];
  }
};

/**
 * Get a specific property feature by ID
 */
export const fetchPropertyFeature = async (id: string): Promise<PropertyFeature | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.featureDetail(id));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.features.alerts.fetchFeatureError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyFeature>(response.data.data || null);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.fetchFeatureError');
    showToast(
      'property-feature-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching property feature ${id}:`, error);
    return null;
  }
};

/**
 * Create a new property feature
 */
export const createPropertyFeature = async (featureData: PropertyFeatureFormData): Promise<PropertyFeature | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the featureData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(featureData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyFeatureApiResponse<PropertyFeature>>(
      endpoints.createFeature,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.features.alerts.createError'));
    }
    
    showToast(
      'property-feature-created',
      t('success'),
      t('property.features.alerts.featureCreated'),
      'success'
    );
    
    return transformToCamelCase<PropertyFeature>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.createError');
    showToast(
      'property-feature-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating property feature:", error);
    return null;
  }
};

/**
 * Update an existing property feature
 */
export const updatePropertyFeature = async (id: string, featureData: Partial<PropertyFeatureFormData>): Promise<PropertyFeature | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the featureData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(featureData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyFeatureApiResponse<PropertyFeature>>(
      endpoints.updateFeature(id),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.features.alerts.updateError'));
    }
    
    showToast(
      'property-feature-updated',
      t('success'),
      t('property.features.alerts.featureUpdated'),
      'success'
    );
    
    return transformToCamelCase<PropertyFeature>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.updateError');
    showToast(
      'property-feature-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property feature ${id}:`, error);
    return null;
  }
};

/**
 * Delete a property feature
 */
export const deletePropertyFeature = async (id: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyFeatureApiResponse<null>>(endpoints.deleteFeature(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.features.alerts.deleteError'));
    }
    
    showToast(
      'property-feature-deleted',
      t('success'),
      t('property.features.alerts.featureDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.deleteError');
    showToast(
      'property-feature-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting property feature ${id}:`, error);
    return false;
  }
};

/**
 * Get features for a specific property
 */
export const fetchFeaturesByPropertyId = async (propertyId: string): Promise<PropertyFeature[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.propertyFeatures(propertyId));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.features.alerts.fetchPropertyFeaturesError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyFeature[]>(response.data.data || []);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.fetchPropertyFeaturesError');
    showToast(
      'property-features-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching features for property ${propertyId}:`, error);
    return [];
  }
};

/**
 * Add features to a property
 */
export const addFeaturesToProperty = async (propertyId: string, featureIds: string[]): Promise<PropertyFeature[] | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyFeatureApiResponse<PropertyFeature[]>>(
      endpoints.addFeaturesToProperty(propertyId),
      { feature_ids: featureIds }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.features.alerts.addFeaturesError'));
    }
    
    showToast(
      'property-features-added',
      t('success'),
      t('property.features.alerts.featuresAdded'),
      'success'
    );
    
    return transformToCamelCase<PropertyFeature[]>(response.data.data || []);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.addFeaturesError');
    showToast(
      'property-features-add-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error adding features to property ${propertyId}:`, error);
    return null;
  }
};

/**
 * Remove a feature from a property
 */
export const removeFeatureFromProperty = async (propertyId: string, featureId: string): Promise<PropertyFeature[] | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyFeatureApiResponse<PropertyFeature[]>>(
      endpoints.removeFeatureFromProperty(propertyId, featureId)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.features.alerts.removeFeatureError'));
    }
    
    showToast(
      'property-feature-removed',
      t('success'),
      t('property.features.alerts.featureRemoved'),
      'success'
    );
    
    return transformToCamelCase<PropertyFeature[]>(response.data.data || []);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.features.alerts.removeFeatureError');
    showToast(
      'property-feature-remove-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error removing feature ${featureId} from property ${propertyId}:`, error);
    return null;
  }
};