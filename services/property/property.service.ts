// Property Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import { useNuxtApp } from "#app";

// Import types from models
import type {
  Property,
  PropertyFormData,
  PropertyFilters,
  PropertyApiResponse,
  PropertySearchResult,
  PropertyWithRelations
} from "~/models/entities/property/property.model";

import { PropertyStatus, PropertyType, ListingType } from "~/models/entities/property/property.model";

// Re-export types for external use
export type {
  Property,
  PropertyFormData,
  PropertyFilters,
  PropertyApiResponse,
  PropertySearchResult,
  PropertyWithRelations
};

// Re-export enums
export { PropertyStatus, PropertyType, ListingType };

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
    
    // Special case mappings for property name differences
    let mappedKey = camelKey;
    if (key === 'status') {
      mappedKey = 'status'; // Already matches
    } else if (key === 'listing_type') {
      mappedKey = 'listingType';
    } else if (key === 'construction_year') {
      mappedKey = 'constructionYear';
    } else if (key === 'acquisition_date') {
      mappedKey = 'acquisitionDate';
    } else if (key === 'estimated_value') {
      mappedKey = 'estimatedValue';
    } else if (key === 'annual_taxes') {
      mappedKey = 'annualTaxes';
    } else if (key === 'maintenance_costs') {
      mappedKey = 'maintenanceCosts';
    } else if (key === 'assigned_agent') {
      mappedKey = 'assignedAgent';
    } else if (key === 'created_at') {
      mappedKey = 'createdAt';
    } else if (key === 'updated_at') {
      mappedKey = 'updatedAt';
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
    
    // Special case mappings for backend
    if (key === 'listingType') {
      transformed['listing_type'] = data[key];
    } else if (key === 'constructionYear') {
      transformed['construction_year'] = data[key];
    } else if (key === 'acquisitionDate') {
      transformed['acquisition_date'] = data[key];
    } else if (key === 'estimatedValue') {
      transformed['estimated_value'] = data[key];
    } else if (key === 'annualTaxes') {
      transformed['annual_taxes'] = data[key];
    } else if (key === 'maintenanceCosts') {
      transformed['maintenance_costs'] = data[key];
    } else if (key === 'assignedAgentId') {
      transformed['assigned_agent_id'] = data[key];
    } else {
      transformed[snakeKey] = data[key];
    }
  });
  
  return transformed;
};

/**
 * Get all properties with optional filters
 */
export const fetchProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  const { t } = getI18n();
  
  try {
    const queryParams = filters ? new URLSearchParams() : undefined;
    
    if (filters) {
      // Convert filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'agentId') {
            queryParams?.append('assigned_agent_id', value);
          } else if (key === 'minPrice') {
            queryParams?.append('min_price', value.toString());
          } else if (key === 'maxPrice') {
            queryParams?.append('max_price', value.toString());
          } else if (key === 'minBedrooms') {
            queryParams?.append('min_bedrooms', value.toString());
          } else if (key === 'minBathrooms') {
            queryParams?.append('min_bathrooms', value.toString());
          } else if (key === 'listingType') {
            queryParams?.append('listing_type', value);
          } else {
            queryParams?.append(
              key.replace(/([A-Z])/g, '_$1').toLowerCase(), 
              value.toString()
            );
          }
        }
      });
    }
    
    const endpoints = getEndpoints();
    const url = endpoints.all + (queryParams ? `?${queryParams.toString()}` : '');
    const response = await getHttp().get(url);
    console.log('Properties response:', response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<Property[]>(response.data.data || []);
    console.log('Transformed properties:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.fetchError');
    showToast(
      'property-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error fetching properties:", error);
    return [];
  }
};

/**
 * Get public properties for listing
 */
export const fetchPublicProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  const { t } = getI18n();
  
  try {
    const queryParams = filters ? new URLSearchParams() : undefined;
    
    if (filters) {
      // Convert filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'minPrice') {
            queryParams?.append('min_price', value.toString());
          } else if (key === 'maxPrice') {
            queryParams?.append('max_price', value.toString());
          } else if (key === 'minBedrooms') {
            queryParams?.append('min_bedrooms', value.toString());
          } else if (key === 'minBathrooms') {
            queryParams?.append('min_bathrooms', value.toString());
          } else if (key === 'listingType') {
            queryParams?.append('listing_type', value);
          } else {
            queryParams?.append(
              key.replace(/([A-Z])/g, '_$1').toLowerCase(), 
              value.toString()
            );
          }
        }
      });
    }
    
    const endpoints = getEndpoints();
    const url = endpoints.public + (queryParams ? `?${queryParams.toString()}` : '');
    const response = await getHttp().get(url);
    console.log('Public properties response:', response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<Property[]>(response.data.data || []);
    console.log('Transformed public properties:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.fetchError');
    // Don't show toast for public page errors
    console.error("Error fetching public properties:", error);
    return [];
  }
};

/**
 * Get a specific property by ID
 */
export const fetchProperty = async (id: string): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.detail(id));
    console.log(`Property ${id} response:`, response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.alerts.fetchPropertyError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<Property>(response.data.data || null);
    console.log('Transformed property:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.fetchPropertyError');
    showToast(
      'property-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }
};

/**
 * Get a specific public property by ID
 */
export const fetchPublicProperty = async (id: string): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.publicDetail(id));
    console.log(`Public property ${id} response:`, response.data);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.alerts.fetchPropertyError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<Property>(response.data.data || null);
    console.log('Transformed public property:', transformedData);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.fetchPropertyError');
    // Don't show toast for public page errors
    console.error(`Error fetching public property ${id}:`, error);
    return null;
  }
};

/**
 * Create a new property
 */
export const createProperty = async (propertyData: PropertyFormData): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the propertyData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(propertyData);
    console.log('Sending property data:', transformedData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyApiResponse<Property>>(
      endpoints.create,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.createError'));
    }
    
    showToast(
      'property-created',
      t('success'),
      t('property.alerts.propertyCreated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.createError');
    showToast(
      'property-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating property:", error);
    return null;
  }
};

/**
 * Create a complete property with all related data
 */
export const createCompleteProperty = async (propertyData: PropertyWithRelations): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the propertyData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(propertyData);
    
    // Transform nested arrays
    if (propertyData.locations) {
      transformedData.locations = propertyData.locations.map(location => transformToSnakeCase(location));
    }
    if (propertyData.media) {
      transformedData.media = propertyData.media.map(media => transformToSnakeCase(media));
    }
    if (propertyData.documents) {
      transformedData.documents = propertyData.documents.map(document => transformToSnakeCase(document));
    }
    
    // Keep feature IDs as is
    if (propertyData.featureIds) {
      transformedData.feature_ids = propertyData.featureIds;
    }
    
    console.log('Sending complete property data:', transformedData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyApiResponse<Property>>(
      endpoints.createComplete,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.createError'));
    }
    
    showToast(
      'property-created',
      t('success'),
      t('property.alerts.propertyCreated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.createError');
    showToast(
      'property-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating complete property:", error);
    return null;
  }
};

/**
 * Update an existing property
 */
export const updateProperty = async (id: string, propertyData: Partial<PropertyFormData>): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the propertyData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(propertyData);
    console.log(`Updating property ${id} with data:`, transformedData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyApiResponse<Property>>(
      endpoints.update(id),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.updateError'));
    }
    
    showToast(
      'property-updated',
      t('success'),
      t('property.alerts.propertyUpdated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.updateError');
    showToast(
      'property-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property ${id}:`, error);
    return null;
  }
};

/**
 * Update a complete property with all related data
 */
export const updateCompleteProperty = async (id: string, propertyData: Partial<PropertyWithRelations>): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the propertyData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(propertyData);
    
    // Transform nested arrays
    if (propertyData.locations) {
      transformedData.locations = propertyData.locations.map(location => transformToSnakeCase(location));
    }
    if (propertyData.media) {
      transformedData.media = propertyData.media.map(media => transformToSnakeCase(media));
    }
    if (propertyData.documents) {
      transformedData.documents = propertyData.documents.map(document => transformToSnakeCase(document));
    }
    
    // Keep feature IDs as is
    if (propertyData.featureIds) {
      transformedData.feature_ids = propertyData.featureIds;
    }
    
    console.log(`Updating complete property ${id} with data:`, transformedData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyApiResponse<Property>>(
      endpoints.updateComplete(id),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.updateError'));
    }
    
    showToast(
      'property-updated',
      t('success'),
      t('property.alerts.propertyUpdated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.updateError');
    showToast(
      'property-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating complete property ${id}:`, error);
    return null;
  }
};

/**
 * Delete a property
 */
export const deleteProperty = async (id: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyApiResponse<null>>(endpoints.delete(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.deleteError'));
    }
    
    showToast(
      'property-deleted',
      t('success'),
      t('property.alerts.propertyDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.deleteError');
    showToast(
      'property-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting property ${id}:`, error);
    return false;
  }
};

/**
 * Delete a complete property with all related data
 */
export const deleteCompleteProperty = async (id: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyApiResponse<null>>(endpoints.deleteComplete(id));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.deleteError'));
    }
    
    showToast(
      'property-deleted',
      t('success'),
      t('property.alerts.propertyDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.deleteError');
    showToast(
      'property-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting complete property ${id}:`, error);
    return false;
  }
};

/**
 * Update property status
 */
export const updatePropertyStatus = async (id: string, status: PropertyStatus): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().patch<PropertyApiResponse<Property>>(
      endpoints.updateStatus(id),
      { status }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.updateStatusError'));
    }
    
    showToast(
      'property-status-updated',
      t('success'),
      t('property.alerts.statusUpdated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.updateStatusError');
    showToast(
      'property-status-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property status ${id}:`, error);
    return null;
  }
};

/**
 * Toggle property featured status
 */
export const togglePropertyFeatured = async (id: string): Promise<Property | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().patch<PropertyApiResponse<Property>>(
      endpoints.toggleFeatured(id),
      {}
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.toggleFeaturedError'));
    }
    
    showToast(
      'property-featured-updated',
      t('success'),
      t('property.alerts.featuredUpdated'),
      'success'
    );
    
    return transformToCamelCase<Property>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.toggleFeaturedError');
    showToast(
      'property-featured-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error toggling property featured ${id}:`, error);
    return null;
  }
};

/**
 * Search properties
 */
export const searchProperties = async (query: string): Promise<PropertySearchResult[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(`${endpoints.search}?q=${encodeURIComponent(query)}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.alerts.searchError'));
    }
    
    return transformToCamelCase<PropertySearchResult[]>(response.data.data || []);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.alerts.searchError');
    showToast(
      'property-search-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error searching properties with query "${query}":`, error);
    return [];
  }
};