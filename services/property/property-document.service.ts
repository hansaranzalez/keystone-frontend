// Property Document Service - Functional Programming Pattern
import { useToast } from "#ui/composables/useToast";
import { useI18n } from "vue-i18n";
import { useHttp } from "~/composables/useHttp";
import type { HTTPError } from "~/utils/http";
import { useNuxtApp } from "#app";

// Import types from models
import type {
  PropertyDocument,
  PropertyDocumentFormData,
  PropertyDocumentApiResponse
} from "~/models/entities/property/property-document.model";

import { DocumentType } from "~/models/entities/property/property-document.model";

// Re-export types for external use
export type {
  PropertyDocument,
  PropertyDocumentFormData,
  PropertyDocumentApiResponse
};

// Re-export enum
export { DocumentType };

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
    if (key === 'file_name') {
      mappedKey = 'fileName';
    } else if (key === 'file_url') {
      mappedKey = 'fileUrl';
    } else if (key === 'document_type') {
      mappedKey = 'documentType';
    } else if (key === 'file_size') {
      mappedKey = 'fileSize';
    } else if (key === 'created_at') {
      mappedKey = 'createdAt';
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
    if (key === 'fileName') {
      transformed['file_name'] = data[key];
    } else if (key === 'fileUrl') {
      transformed['file_url'] = data[key];
    } else if (key === 'documentType') {
      transformed['document_type'] = data[key];
    } else if (key === 'fileSize') {
      transformed['file_size'] = data[key];
    } else if (key === 'propertyId') {
      transformed['property_id'] = data[key];
    } else {
      transformed[snakeKey] = data[key];
    }
  });
  
  return transformed;
};

/**
 * Get all documents for a property
 */
export const fetchPropertyDocuments = async (propertyId: string, documentType?: DocumentType): Promise<PropertyDocument[]> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const url = documentType 
      ? `${endpoints.documents(propertyId)}?document_type=${encodeURIComponent(documentType)}`
      : endpoints.documents(propertyId);
      
    const response = await getHttp().get(url);
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.documents.alerts.fetchError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyDocument[]>(response.data.data || []);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.fetchError');
    showToast(
      'property-documents-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching documents for property ${propertyId}:`, error);
    return [];
  }
};

/**
 * Get a specific document by ID
 */
export const fetchPropertyDocumentById = async (documentId: string): Promise<PropertyDocument | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().get(endpoints.documentDetail(documentId));
    
    // Check for success in both formats (success: boolean or status: 'success')
    const isSuccess = response.data.success === true || response.data.status === 'success';
    
    if (!isSuccess) {
      throw new Error(response.data.message || t('property.documents.alerts.fetchDocumentError'));
    }
    
    // Transform the snake_case response to camelCase for our model
    const transformedData = transformToCamelCase<PropertyDocument>(response.data.data || null);
    
    return transformedData;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.fetchDocumentError');
    showToast(
      'property-document-fetch-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error fetching property document ${documentId}:`, error);
    return null;
  }
};

/**
 * Create a new document
 */
export const createPropertyDocument = async (documentData: PropertyDocumentFormData): Promise<PropertyDocument | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the documentData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(documentData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().post<PropertyDocumentApiResponse<PropertyDocument>>(
      endpoints.createDocument,
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.documents.alerts.createError'));
    }
    
    showToast(
      'property-document-created',
      t('success'),
      t('property.documents.alerts.documentCreated'),
      'success'
    );
    
    return transformToCamelCase<PropertyDocument>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.createError');
    showToast(
      'property-document-create-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error("Error creating property document:", error);
    return null;
  }
};

/**
 * Update an existing document
 */
export const updatePropertyDocument = async (documentId: string, documentData: Partial<PropertyDocumentFormData>): Promise<PropertyDocument | null> => {
  const { t } = getI18n();
  
  try {
    // Transform the documentData to snake_case for backend compatibility
    const transformedData = transformToSnakeCase(documentData);
    
    const endpoints = getEndpoints();
    const response = await getHttp().put<PropertyDocumentApiResponse<PropertyDocument>>(
      endpoints.updateDocument(documentId),
      transformedData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.documents.alerts.updateError'));
    }
    
    showToast(
      'property-document-updated',
      t('success'),
      t('property.documents.alerts.documentUpdated'),
      'success'
    );
    
    return transformToCamelCase<PropertyDocument>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.updateError');
    showToast(
      'property-document-update-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error updating property document ${documentId}:`, error);
    return null;
  }
};

/**
 * Delete a document
 */
export const deletePropertyDocument = async (documentId: string): Promise<boolean> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const response = await getHttp().delete<PropertyDocumentApiResponse<null>>(endpoints.deleteDocument(documentId));
    
    if (!response.data.success) {
      throw new Error(response.data.message || t('property.documents.alerts.deleteError'));
    }
    
    showToast(
      'property-document-deleted',
      t('success'),
      t('property.documents.alerts.documentDeleted'),
      'info'
    );
    
    return true;
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.deleteError');
    showToast(
      'property-document-delete-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error deleting property document ${documentId}:`, error);
    return false;
  }
};

/**
 * Upload document for a property with progress tracking
 */
export const uploadPropertyDocument = async (
  propertyId: string, 
  formData: FormData, 
  onProgress?: (progress: number) => void
): Promise<PropertyDocument | null> => {
  const { t } = getI18n();
  
  try {
    const endpoints = getEndpoints();
    const http = getHttp();
    
    const response = await http.post<PropertyDocumentApiResponse<PropertyDocument>>(
      endpoints.uploadDocument(propertyId),
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
      throw new Error(response.data.message || t('property.documents.alerts.uploadError'));
    }
    
    showToast(
      'property-document-uploaded',
      t('success'),
      t('property.documents.alerts.documentUploaded'),
      'success'
    );
    
    return transformToCamelCase<PropertyDocument>(response.data.data);
  } catch (error) {
    const errorMessage = (error as HTTPError).response?.data?.message || 
                         t('property.documents.alerts.uploadError');
    showToast(
      'property-document-upload-error',
      t('error'),
      errorMessage,
      'error'
    );
    console.error(`Error uploading document for property ${propertyId}:`, error);
    return null;
  }
};