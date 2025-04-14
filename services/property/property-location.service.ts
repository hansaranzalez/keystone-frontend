// Property Location Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import { useNuxtApp } from "#app";

// Import types from models
import type {
  PropertyLocation,
  PropertyLocationFormData,
  PropertyLocationApiResponse,
  GeoCoordinates
} from "~/models/entities/property/property-location.model";

import { ZoneType } from "~/models/entities/property/property-location.model";

// Re-export types for external use
export type {
  PropertyLocation,
  PropertyLocationFormData,
  PropertyLocationApiResponse,
  GeoCoordinates
};

// Re-export enum
export { ZoneType };

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
    if (key === 'unit_number') {
      mappedKey = 'unitNumber';
    } else if (key === 'zip_code') {
      mappedKey = 'zipCode';
    } else if (key === 'zone_type') {
      mappedKey = 'zoneType';
    } else if (key === 'additional_directions') {
      mappedKey = 'additionalDirections';
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
    if (key === 'unitNumber') {
      transformed['unit_number'] = data[key];
    } else if (key === 'zipCode') {
      transformed['zip_code'] = data[key];
    } else if (key === 'zoneType') {
      transformed['zone_type'] = data[key];
    } else if (key === 'additionalDirections') {
      transformed['additional_directions'] = data[key];
    } else if (key === 'propertyId') {
      transformed['property_id'] = data[key];
    } else {
      transformed[snakeKey] = data[key];
    }
  });
  
  return transformed;
};

/**
 * Get all locations for a property
 */
export const fetchPropertyLocations = async (propertyId: string): Promise<PropertyLocation[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.locations(propertyId));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.locations.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyLocation[]>(response.data.data || []);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.fetchError');
    showToast(
      'property-locations-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching locations for property ${propertyId}:`, error);
    return [];
  }
};

/**
 * Get a specific location by ID
 */
export const fetchPropertyLocation = async (locationId: string): Promise<PropertyLocation | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.locationDetail(locationId));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.locations.alerts.fetchLocationError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyLocation>(response.data.data || null);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.fetchLocationError');
    showToast(
      'property-location-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching property location ${locationId}:`, error);
    return null;
  }
};

/**
 * Create a new location
 */
export const createPropertyLocation = async (locationData: PropertyLocationFormData): Promise<PropertyLocation | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the locationData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(locationData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyLocationApiResponse<PropertyLocation>>(
      endpoints.createLocation,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.locations.alerts.createError'));
    }
    
    showToast(
      'property-location-created',
      t('success'),
      t('property.locations.alerts.locationCreated'),
      'success'
    );
    
    return transformToCamelCase<PropertyLocation>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.createError');
    showToast(
      'property-location-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating property location:", error);
    return null;
  }
};

/**
 * Update an existing location
 */
export const updatePropertyLocation = async (locationId: string, locationData: Partial<PropertyLocationFormData>): Promise<PropertyLocation | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the locationData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(locationData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyLocationApiResponse<PropertyLocation>>(
      endpoints.updateLocation(locationId),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.locations.alerts.updateError'));
    }
    
    showToast(
      'property-location-updated',
      t('success'),
      t('property.locations.alerts.locationUpdated'),
      'success'
    );
    
    return transformToCamelCase<PropertyLocation>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.updateError');
    showToast(
      'property-location-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property location ${locationId}:`, error);
    return null;
  }
};

/**
 * Delete a location
 */
export const deletePropertyLocation = async (locationId: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyLocationApiResponse<null>>(endpoints.deleteLocation(locationId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.locations.alerts.deleteError'));
    }
    
    showToast(
      'property-location-deleted',
      t('success'),
      t('property.locations.alerts.locationDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.deleteError');
    showToast(
      'property-location-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting property location ${locationId}:`, error);
    return false;
  }
};

/**
 * Geocode an address to get coordinates
 */
export const geocodeAddress = async (address: string): Promise<GeoCoordinates | null> => {
  const { t } = getI18n();
  
  try {
    // This would typically call a geocoding service - implement appropriate endpoint
    const http = getHttp();
    const response = await http.get(`/api/geocode?address=${encodeURIComponent(address)}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.locations.alerts.geocodeError'));
    }
    
    return {
      latitude: response.data.data.latitude,
      longitude: response.data.data.longitude
    };
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.locations.alerts.geocodeError');
    showToast(
      'geocode-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
};