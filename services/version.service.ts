import { useNuxtApp } from '#app';
import { useHttp } from '~/composables/useHttp';

// Define types for version API response
export interface VersionApiResponse {
  api: {
    name: string;
    version: string;
    description: string;
    environment: string;
    build: {
      date: string;
      number: number | null;
    };
    timestamp: string;
    release_date: string | null;
    deprecated: boolean;
    sunset_date: string | null;
  };
  auth: {
    methods: {
      email_password: boolean;
      google: boolean;
      facebook: boolean;
    };
    oauth_providers: {
      google: {
        enabled: boolean;
        client_id: string;
      };
    };
  };
  server: {
    timezone: string;
    current_time: string;
  };
  required_client_version: string | null;
  maintenance_mode: boolean;
}

// Helper functions to get dependencies (following the functional programming pattern)
// These should only be called within a proper Nuxt lifecycle context
const getHttp = () => {
  try {
    return useHttp().http;
  } catch (error) {
    console.error('Error getting HTTP client:', error);
    return null;
  }
};

const getEndpoints = () => {
  try {
    return useNuxtApp().$endpoints;
  } catch (error) {
    console.error('Error accessing Nuxt endpoints:', error);
    return {
      version: '/api/v1/version' // Fallback endpoint
    };
  }
};

// Store for version information
let versionInfo: VersionApiResponse | null = null;

/**
 * Fetches the API version information from the backend
 * @param force Whether to force a refresh of the version information
 * @returns A promise that resolves to the version information
 */
export const fetchVersionInfo = async (force = false): Promise<VersionApiResponse> => {
  // Return cached version if available and not forced to refresh
  if (versionInfo && !force) {
    return versionInfo;
  }

  try {
    const endpointUrl = getEndpoints().version;
    console.log('Fetching API version from URL:', endpointUrl);
    
    const http = getHttp();
    if (!http) {
      console.error('HTTP client is undefined!');
      throw new Error('HTTP client is undefined');
    }
    
    console.log('Making GET request to version endpoint...');
    const response = await http.get(endpointUrl);
    console.log('API response received:', response);
    console.log('Response status:', response?.status);
    console.log('Response data:', JSON.stringify(response?.data, null, 2));
    
    if (!response || !response.data) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from version API');
    }
    
    versionInfo = response.data as VersionApiResponse;
    console.log('Version info parsed successfully:', JSON.stringify(versionInfo, null, 2));
    return versionInfo;
  } catch (error) {
    console.error('Error fetching API version information:', error);
    throw error;
  }
};

/**
 * Returns the API version as a string
 * @returns A promise that resolves to the API version string
 */
export const getApiVersion = async (): Promise<string> => {
  try {
    // Force refresh to make sure we're getting the latest data
    const versionData = await fetchVersionInfo(true);
    console.log('Processed version data in getApiVersion:', versionData);
    
    if (versionData && versionData.api && versionData.api.version) {
      console.log('Successfully extracted API version:', versionData.api.version);
      return versionData.api.version;
    }
    
    console.warn('API version data is missing expected structure:', versionData);
    return 'Unknown';
  } catch (error) {
    console.error('Error getting API version:', error);
    return 'Unknown';
  }
};

/**
 * Returns information about which authentication methods are enabled
 * @returns A promise that resolves to the auth methods object
 */
export const getAuthMethods = async (): Promise<VersionApiResponse['auth']['methods']> => {
  try {
    const versionData = await fetchVersionInfo();
    return versionData.auth.methods;
  } catch (error) {
    console.error('Error getting auth methods:', error);
    return {
      email_password: true,
      google: false,
      facebook: false
    };
  }
};

/**
 * Checks if the system is in maintenance mode
 * @returns A promise that resolves to a boolean indicating if maintenance mode is active
 */
export const isInMaintenanceMode = async (): Promise<boolean> => {
  try {
    const versionData = await fetchVersionInfo();
    return versionData.maintenance_mode;
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false;
  }
};

// Use the functional approach, similar to auth.service.ts
export const useVersionService = () => {
  return {
    fetchVersionInfo,
    getApiVersion,
    getAuthMethods,
    isInMaintenanceMode
  };
};

// Export initialization function to be called from a proper Nuxt lifecycle hook
export const initVersionService = (): void => {
  // Only initialize if we're in a client context where useNuxtApp is available
  if (process.client) {
    try {
      // Ensure we have access to Nuxt app before proceeding
      const nuxtApp = useNuxtApp();
      if (nuxtApp) {
        fetchVersionInfo().catch(error => {
          console.warn('Failed to fetch initial version information:', error);
        });
      }
    } catch (error) {
      console.warn('Skipping version service initialization outside of Nuxt context');
    }
  }
};

// Do NOT initialize at the module level - this will be done in a plugin
