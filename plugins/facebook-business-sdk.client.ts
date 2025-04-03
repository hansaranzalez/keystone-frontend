// plugins/facebook-business-sdk.client.ts
import { defineNuxtPlugin } from '#app';

// Define the key interfaces without using global declarations
interface FacebookBusinessAPIResponse {
  [key: string]: any;
}

interface FacebookBusinessLoginResponse {
  status: string;
  authResponse?: {
    accessToken: string;
    userID: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define the plugin's API interface for typing
interface FacebookBusinessSdkInterface {
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (config?: { scope?: string, config_id?: string }) => Promise<FacebookBusinessLoginResponse>;
  getWhatsAppBusinessAccounts: () => Promise<FacebookBusinessAPIResponse>;
  getLoginStatus: () => Promise<FacebookBusinessLoginResponse>;
  logout: () => Promise<FacebookBusinessAPIResponse>;
}

export type { FacebookBusinessSdkInterface, FacebookBusinessLoginResponse, FacebookBusinessAPIResponse }

// Add declare statements to ensure TypeScript recognizes the global FB object
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default defineNuxtPlugin<{ fbBusinessSdk: FacebookBusinessSdkInterface | null }>((nuxtApp) => {
  const config = useRuntimeConfig();
  const FB_APP_ID = config.public.facebookAppId;
  
  // Return early if no App ID is configured
  if (!FB_APP_ID) {
    console.warn('Facebook App ID not configured. WhatsApp integration will not work.');
    return {
      provide: {
        fbBusinessSdk: null
      }
    };
  }
  
  // Track SDK initialization state
  let initialized = false;
  let initPromise: Promise<void> | null = null;
  
  // Initialize Facebook Business SDK - simplified approach
  const initFacebookBusinessSdk = () => {
    console.log('Initializing Facebook Business SDK with App ID:', FB_APP_ID);
    
    return new Promise<void>((resolve, reject) => {
      // If already loaded and initialized, resolve immediately
      if (window.FB) {
        console.log('Facebook SDK already loaded, re-initializing with business app ID');
        try {
          window.FB.init({
            appId: FB_APP_ID,
            version: 'v18.0',
            cookie: true,
            xfbml: true
          });
          initialized = true;
          console.log('Facebook SDK re-initialized with business app ID');
          resolve();
        } catch (error) {
          console.error('Error re-initializing Facebook SDK:', error);
          reject(error);
        }
        return;
      }
      
      // Define the async init function - no need to check for existing one since we removed the regular SDK
      window.fbAsyncInit = function() {
        console.log('fbAsyncInit called for Business SDK');
        try {
          window.FB.init({
            appId: FB_APP_ID,
            version: 'v18.0',
            cookie: true,
            xfbml: true
          });
          
          initialized = true;
          console.log('Facebook Business SDK successfully initialized');
          resolve();
        } catch (error) {
          console.error('Error during FB.init():', error);
          reject(error);
        }
      };
      
      // Load the Facebook SDK asynchronously
      try {
        // Remove any existing script to avoid conflicts
        const existingScript = document.getElementById('facebook-jssdk');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
          console.log('Removed existing Facebook SDK script');
        }
        
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        
        script.onload = () => {
          console.log('Facebook SDK script loaded successfully');
          // fbAsyncInit should be called automatically
        };
        
        script.onerror = (event) => {
          console.error('Error loading Facebook SDK script:', event);
          reject(new Error('Failed to load Facebook SDK script'));
        };
        
        // Insert the script into the document
        document.head.appendChild(script);
        console.log('Facebook SDK script added to document');
      } catch (error) {
        console.error('Error creating script element:', error);
        reject(error);
      }
    });
  };
  
  // Ensure the SDK is initialized
  const ensureInitialized = () => {
    if (!initPromise) {
      initPromise = initFacebookBusinessSdk().then(() => {
        initialized = !!window.FB;
        
        if (!initialized) {
          console.warn('FB SDK script loaded but FB object not available');
          initPromise = null;
          return Promise.reject(new Error('Facebook Business SDK failed to initialize'));
        }
      }).catch(err => {
        console.error('Facebook Business SDK initialization error:', err);
        initPromise = null;
        return Promise.reject(err);
      });
    }
    return initPromise;
  };
  
  // Initial attempt to initialize the SDK
  ensureInitialized().catch(err => {
    console.warn('Initial Facebook Business SDK initialization failed:', err);
  });
  
  // Facebook Business login with permission for WhatsApp
  const login = async (config?: { scope?: string, config_id?: string }): Promise<FacebookBusinessLoginResponse> => {
    try {
      console.log('Facebook Business login called with config:', config);
      await ensureInitialized();
      
      if (!window.FB) {
        console.error('FB object not available after initialization');
        throw new Error('Facebook Business SDK not initialized');
      }
      
      console.log('Facebook Business SDK initialized, window.FB exists:', !!window.FB);
      console.log('FB.login function exists:', typeof window.FB.login === 'function');
      
      return new Promise((resolve, reject) => {
        try {
          console.log('Calling FB.login with scope:', config?.scope || 'whatsapp_business_messaging,whatsapp_business_management');
          
          // Wrap in setTimeout to ensure it runs after any UI updates
          setTimeout(() => {
            window.FB!.login((response: any) => {
              console.log('Facebook Business login response:', response);
              
              // More detailed error reporting
              if (response.status === 'connected') {
                console.log('Facebook login successful with connected status');
                resolve(response as FacebookBusinessLoginResponse);
              } else if (response.status === 'not_authorized') {
                console.warn('User did not authorize the app');
                // Return the response anyway to let the application handle it
                resolve(response as FacebookBusinessLoginResponse);
              } else if (response.authResponse && response.authResponse.code) {
                // Handle OAuth code flow response - this is actually a success case
                // Facebook SDK reports status as 'unknown' when using response_type='code'
                console.log('Facebook login returned authorization code - treating as success');
                
                // Create a proper response object with the OAuth code
                const successResponse: FacebookBusinessLoginResponse = {
                  status: 'connected', // Mark as connected since we got a code
                  authResponse: {
                    accessToken: response.authResponse.code, // Use the code as a temporary token
                    userID: response.authResponse.userID || 'pending', // UserID might come from backend after token exchange
                    expiresIn: 3600, // Default to 1 hour until we know more from backend
                    code: response.authResponse.code
                  }
                };
                
                resolve(successResponse);
              } else {
                // Include the status in the error message for better debugging
                const errorMessage = `Facebook Business login failed with status: ${response.status || 'unknown'}`;
                console.error(errorMessage, response);
                
                // If there's an error object in the response, include that information
                if (response.error) {
                  console.error('Facebook login error details:', response.error);
                  reject(new Error(`${errorMessage} - ${response.error.message || 'No error details'}`));
                } else {
                  reject(new Error(errorMessage));
                }
              }
            }, {
              scope: config?.scope || 'whatsapp_business_messaging,whatsapp_business_management',
              config_id: config?.config_id,
              response_type: 'code',  // MUST be 'code' for System-user access tokens
              override_default_response_type: true  // Required when using 'code'
            });
          }, 100);
        } catch (loginError) {
          console.error('Error during FB.login call:', loginError);
          reject(loginError);
        }
      });
    } catch (error) {
      console.error('Error during Facebook Business login preparation:', error);
      throw error;
    }
  };
  
  // Get WhatsApp Business Accounts for the logged-in user
  const getWhatsAppBusinessAccounts = async (): Promise<FacebookBusinessAPIResponse> => {
    try {
      await ensureInitialized();
      
      if (!window.FB) {
        throw new Error('Facebook Business SDK not initialized');
      }
      
      return new Promise<FacebookBusinessAPIResponse>((resolve, reject) => {
        window.FB!.api(
          '/me/businesses',
          { fields: 'id,name,verification_status,business_users{role},client_business_id' },
          (response: any) => {
            if (!response || response.error) {
              console.error('Error fetching WhatsApp Business accounts:', response?.error);
              reject(new Error('Failed to get WhatsApp Business accounts'));
              return;
            }
            console.log('WhatsApp Business accounts:', response);
            resolve(response as FacebookBusinessAPIResponse);
          }
        );
      });
    } catch (error) {
      console.error('Error getting WhatsApp Business accounts:', error);
      throw error;
    }
  };
  
  // Provide the SDK functions to the app
  return {
    provide: {
      fbBusinessSdk: {
        get initialized() { return initialized; },
        initialize: ensureInitialized,
        login,
        getWhatsAppBusinessAccounts,
        getLoginStatus: async () => {
          try {
            await ensureInitialized();
            
            if (!window.FB) {
              throw new Error('Facebook Business SDK not initialized');
            }
            
            return new Promise((resolve, reject) => {
              // Force a roundtrip to FB to get fresh data
              // Note: TypeScript doesn't know about the second boolean parameter Facebook SDK accepts
              (window.FB!.getLoginStatus as any)((response: any) => {
                if (!response) {
                  reject(new Error('Failed to get login status'));
                  return;
                }
                resolve(response as FacebookBusinessLoginResponse);
              }, true);
            });
          } catch (error) {
            console.error('Error getting Facebook Business login status:', error);
            throw error;
          }
        },
        logout: async () => {
          try {
            await ensureInitialized();
            
            if (!window.FB) {
              throw new Error('Facebook Business SDK not initialized');
            }
            
            return new Promise((resolve, reject) => {
              window.FB!.logout((response: any) => {
                if (!response) {
                  reject(new Error('Failed to logout'));
                  return;
                }
                resolve(response as FacebookBusinessAPIResponse);
              });
            });
          } catch (error) {
            console.error('Error during Facebook Business logout:', error);
            throw error;
          }
        }
      }
    }
  };
});
