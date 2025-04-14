import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Pinia } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useHttp } from '~/composables/useHttp';
import { AuthUser } from '~/models/entities/AuthUser';
import { AuthForms, useAuthStore } from '~/store/authStore';
import { useUiStore } from '~/store/ui.store';
import { HttpStatus } from '~/types/auth.type';
import { v4 as uuidv4 } from 'uuid';

// Helper functions to get core dependencies
const getStore = () => {
  const nuxtApp = useNuxtApp();
  return useAuthStore(nuxtApp.$pinia as Pinia);
};

const getEndpoints = () => useNuxtApp().$endpoints;

const getHttp = () => useHttp().http;

// Use this for components to pass their translation function to service methods
interface TranslationFn {
  (key: string): string;
  (key: string, named: Record<string, any>): string;
}

const getI18nMessageFromKey = (key: string, t?: TranslationFn): string => {
  if (t) {
    return t(key);
  }
  // Fallback for when translation function isn't available
  const messages: Record<string, string> = {
    'login.successTitle': '✅ Login successful',
    'login.successMessage': 'Welcome back!',
    'login.errorTitle': '❌ Login failed',
    'login.errorMessage': 'Please check your credentials and try again',
    'login.validationMessages.loginFailed': 'Login failed. Please check your credentials.',
    'login.validationMessages.emailAuthExists': 'This account uses email authentication',
    'login.validationMessages.useEmailToLogin': 'Please login with your email and password instead of social login',
    'login.continueWithGoogle': 'Continue with Google',
    'login.continueWithFacebook': 'Continue with Facebook',
    'login.loginWithFacebook': 'Login with Facebook',
    'login.facebookLoginComingSoon': 'Facebook login functionality will be available soon',
    'login.socialAuthInitiated': 'Social authentication initiated',
    'login.socialAuthError': 'Social authentication failed. Please try again.',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.comingSoon': 'Coming Soon',
    'registration.successTitle': '✅ Registration successful',
    'registration.errorTitle': '❌ Registration failed',
    'registration.registrationSuccess': 'Your account has been created successfully',
    'registration.errors.registrationFailed': 'Registration failed. Please check your information and try again.',
    'registration.errors.googleAuthExists': 'This email is already registered with Google',
    'registration.errors.useGoogleToLogin': 'Please use Google login for this account',
    'registration.errors.emailAuthExists': 'This email is already registered',
    'registration.errors.useEmailToLogin': 'Please use your email and password to login',
    'changePassword.errorMessage': 'Something went wrong, please try again',
    'changePassword.validationMessages.invalidResetCode': 'Invalid reset code',
    'changePassword.successMessage': 'Password changed successfully!',
    'passwordChange.errorMessage': 'Something went wrong, please try again',
    'passwordChange.successMessage': 'We have sent you an email with instructions to change your password.'
  };
  return messages[key] || key;
};

// Token management functions
export const getToken = (): string | null => {
  const token = getStore().token;
  if (token && typeof token === 'string') {
    return token;
  }
  return null;
};

export const setToken = (jwt: string): void => {
  getStore().setToken(jwt);
};

export const hasExpiredToken = (): boolean => {
  const jwt = getToken();
  if (jwt) {
    const payload = jwtDecode(jwt) as any;
    return Date.now() >= payload.exp * 1000;
  }
  return true;
};

export const decodeTokenAndSetUser = (): void => {
  const token = getToken();
  if (token) {
    const decode: JwtPayload = jwtDecode(token);
    const store = getStore();
    store.setToken(token);
    store.setUser(AuthUser.Build(decode));
    return;
  }
  logout();
};

// Core auth functions
export const logout = (): void => {
  console.log('logout');
  getStore().logout();
};

export const login = async (email: string, password: string, t?: TranslationFn): Promise<void> => {
  try {
    useUiStore().setSplashVisible(true);
    const response = await getHttp().post(getEndpoints().login, {
      email,
      password,
    });
    
    if (response.status !== HttpStatus.SUCCESS) throw new Error(getI18nMessageFromKey('login.validationMessages.loginFailed', t));
    
    setToken(response.data.accessToken);
    getStore().setRefreshToken(response.data.refreshToken);
    decodeTokenAndSetUser();
    
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('login.successTitle', t),
      description: getI18nMessageFromKey('login.successMessage', t)
    });
  } catch (error) {
    logout();
    
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('login.errorTitle', t),
      description: getI18nMessageFromKey('login.errorMessage', t)
    });
    
    throw error;
  } finally {
    useUiStore().setSplashVisible(false);
  }
};

export const register = async (name: string, email: string, password: string, t?: TranslationFn, google_auth: boolean = false, profile_image_url?: string): Promise<void> => {
  try {
    useUiStore().setSplashVisible(true);
    const response = await getHttp().post(getEndpoints().register, {
      name,
      email,
      password,
      google_auth,
      profile_image_url
    });
    
    if (response.status !== HttpStatus.SUCCESS && response.status !== HttpStatus.CREATED) {
      throw new Error(getI18nMessageFromKey('auth.registration.errors.registrationFailed', t));
    }
    
    setToken(response.data.accessToken);
    decodeTokenAndSetUser();
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('auth.registration.successTitle', t),
      description: getI18nMessageFromKey('auth.registration.registrationSuccess', t)
    });
    // Navigate to the dashboard instead of showing login form since user is already logged in
    navigateTo('/');
  } catch (error: any) {
    logout();
    
    // Check for auth provider specific errors
    if (error.response?.data?.message === 'User with this email already exists with google' && 
        error.response?.data?.auth_provider === 'google') {
      // Google auth error
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.registration.errorTitle', t),
        description: `${getI18nMessageFromKey('auth.registration.errors.googleAuthExists', t)}. ${getI18nMessageFromKey('auth.registration.errors.useGoogleToLogin', t)}`
      });
    } else if (error.response?.data?.message === 'User with this email already exists with email' && 
              error.response?.data?.auth_provider === 'email') {
      // Email auth error
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.registration.errorTitle', t),
        description: `${getI18nMessageFromKey('auth.registration.errors.emailAuthExists', t)}. ${getI18nMessageFromKey('auth.registration.errors.useEmailToLogin', t)}`
      });
    } else {
      // General registration error
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.registration.errorTitle', t),
        description: getI18nMessageFromKey('auth.registration.errors.registrationFailed', t)
      });
    }
    
    throw error;
  } finally {
    useUiStore().setSplashVisible(false);
  }
};

export const requestPasswordChange = async (email: string, t?: TranslationFn): Promise<void> => {
  try {
    const response = await getHttp().post(getEndpoints().requestPasswordChange, {
      email,
    });
    
    // Handle the standard response pattern: backend always returns success regardless if email exists
    // This is a security feature to prevent user enumeration attacks
    if (response.status !== HttpStatus.SUCCESS) {
      throw new Error(getI18nMessageFromKey('auth.passwordChange.errorMessage', t));
    }
    
    // Save the email for subsequent code verification step
    getStore().setCatchedEmail(email);
    
    // Show success message using backend's message if available
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('auth.passwordChange.successTitle', t),
      description: response.data?.message || getI18nMessageFromKey('auth.passwordChange.successMessage', t)
    });
    
    // Navigate to the email sent confirmation screen
    getStore().setSelectedForm(AuthForms.REQUEST_PASSWORD_RESET_SUCCESS);
  } catch (error: any) {
    // Handle specific error for social media accounts
    if (error.response?.data?.message?.includes('social') || 
        error.response?.data?.message?.includes('google') || 
        error.response?.data?.auth_provider === 'google') {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.passwordChange.errorTitle', t),
        description: getI18nMessageFromKey('auth.passwordChange.socialAccountError', t) || 
                    'Password change is not available for social media accounts. Please use social login.'
      });
    } else {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.passwordChange.errorTitle', t),
        description: error.response?.data?.message || getI18nMessageFromKey('auth.passwordChange.errorMessage', t)
      });
    }
    throw error;
  }
};

export const changePassword = async (newPassword: string, t?: TranslationFn): Promise<void> => {
  try {
    const store = getStore();
    const code = store.changePasswordCodeGetter;
    const email = store.catchedEmailGetter;
    
    if (!code) {
      throw new Error(getI18nMessageFromKey('auth.changePassword.validationMessages.missingToken', t));
    }
    
    if (!email) {
      throw new Error(getI18nMessageFromKey('auth.changePassword.errorMessage', t) || 'Email is missing');
    }
    
    const response = await getHttp().post(getEndpoints().changePassword, {
      email,
      code,
      newPassword,
    });
    
    if (response.status !== HttpStatus.SUCCESS) {
      throw new Error(getI18nMessageFromKey('auth.changePassword.errorMessage', t));
    }
    
    // Show success message
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('auth.changePassword.successTitle', t),
      description: getI18nMessageFromKey('auth.changePassword.successMessage', t)
    });
    
    // Navigate to password change success screen
    store.setSelectedForm(AuthForms.PASSWORD_RESET_SUCCESS);
    
    // Clear the stored verification code and email
    store.setChangePasswordCode('' as any);
    store.setCatchedEmail('' as any);
  } catch (error: any) {
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('auth.changePassword.errorTitle', t),
      description: error.message || getI18nMessageFromKey('auth.changePassword.errorMessage', t)
    });
    throw error;
  }
};

export const verifyActivationCode = async (code: string, t?: TranslationFn): Promise<any> => {
  try {
    const response = await getHttp().post(getEndpoints().verifyActivationCode, {
      code,
    });
    
    //if (response.status !== HttpStatus.SUCCESS) throw new Error(t('activatePassword.errorMessage'));
    
    return response.data;
  } catch (error) {
    // useToast().add({
    //   color: 'error',
    //   title: t('common.error'),
    //   description: t('activatePassword.errorMessage')
    // });
    throw error;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string, t?: TranslationFn): Promise<{ success: boolean }> => {
  try {
    const store = getStore();
    const token = store.token;
    
    if (!token) throw new Error(getI18nMessageFromKey('system.common.unauthorized', t));

    const response = await getHttp().post(getEndpoints().updatePassword, {
      currentPassword,
      newPassword
    });
    
    if (response.status !== HttpStatus.SUCCESS) {
      throw new Error(response.data?.message || getI18nMessageFromKey('auth.passwordChange.errorMessage', t));
    }
    
    return { success: true };
  } catch (error: any) {
    // Handle specific error responses from the backend
    let errorMessage = getI18nMessageFromKey('auth.passwordChange.errorMessage', t);
    
    // Extract error message from response if available
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Look for specific error messages and translate them if needed
    if (errorMessage.includes('incorrect')) {
      errorMessage = getI18nMessageFromKey('auth.passwordChange.incorrectCurrentPassword', t) || 'Current password is incorrect';
    } else if (errorMessage.includes('Google authentication')) {
      errorMessage = getI18nMessageFromKey('auth.passwordChange.googleAuthError', t) || 'Cannot change password for accounts that use Google authentication exclusively';
    } else if (errorMessage.includes('at least 8 characters')) {
      errorMessage = getI18nMessageFromKey('auth.passwordChange.passwordTooShort', t) || 'New password must be at least 8 characters long';
    }
    
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('system.common.error', t),
      description: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

export const verifyPasswordResetCode = async (code: string, t?: TranslationFn): Promise<any> => {
  try {
    // Get the email from the store - this was saved during the request password change step
    const email = getStore().catchedEmail;
    
    if (!email) {
      throw new Error(getI18nMessageFromKey('auth.changePassword.errorMessage', t) || 'Email is missing');
    }
    
    const response = await getHttp().post(getEndpoints().verifyPasswordResetCode, {
      email,
      code,
    });
    
    if (response.status !== HttpStatus.SUCCESS) throw new Error(getI18nMessageFromKey('auth.changePassword.errorMessage', t));
    
    getStore().setChangePasswordCode(response.data.code);
    return response.data;
  } catch (error: any) {
    // Check specifically for invalid verification code error
    const errorMessage = error.response?.data?.message;
    if (errorMessage === "The verification code is invalid") {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('system.common.error', t),
        description: getI18nMessageFromKey('auth.changePassword.validationMessages.invalidResetCode', t) || "The verification code is invalid. Please check and try again."
      });
    } else {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('system.common.error', t),
        description: errorMessage || getI18nMessageFromKey('auth.changePassword.validationMessages.invalidResetCode', t)
      });
    }
    throw error;
  }
};

export const initGoogleLoginFlow = async (t?: TranslationFn): Promise<void> => {
  try {
    window.location.href = getEndpoints().googleLogin;
  } catch (error) {
    logout();
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('auth.login.errorTitle', t),
      description: getI18nMessageFromKey('auth.login.errorMessage', t)
    });
    throw error;
  }
};

// Use this type to define the parameters needed from composables
interface FacebookLoginDeps {
  toast: ReturnType<typeof useToast>;
  translator: TranslationFn;
  endpoints: any;
  router: ReturnType<typeof useRouter>;
  facebookSdk: any;
  facebookConfigId?: string;
}

export const initFacebookWhatsAppIntegration = async (deps: FacebookLoginDeps): Promise<void> => {
  const { toast, translator, endpoints, router, facebookSdk, facebookConfigId } = deps;
  const {http} = useHttp(); // Assuming this composable gives access to your configured axios/fetch instance

  console.log('================ FACEBOOK WHATSAPP INTEGRATION STARTED ================');

  try {
    // --- Prerequisites ---
    if (!facebookSdk) { /* ... handle SDK unavailable ... */ return; }
    // Add HTTPS check if needed again here

    // --- State Parameter Logic ---
    // 1. Generate Unique State
    const state = uuidv4();
    console.log(`Generated state: ${state}`);

    // 2. Prepare State on Backend (Associate state with logged-in CRM User)
    try {
      console.log(`Preparing Facebook OAuth state on backend...`);
      // Assumes your http client automatically sends CRM auth (cookie/token)
      await http.post(endpoints.facebookPrepareState, { state });
      console.log("State prepared successfully on backend.");
    } catch (prepareError: any) {
      console.error('Error preparing Facebook OAuth state on backend:', prepareError.response?.data || prepareError.message);
      toast.add({ color: 'error', title: translator('system.common.error'), description: translator('integrations.facebook.prepareError') });
      return;
    }

    // --- Facebook Login Call ---
    // 3. Initialize SDK (may happen globally, but ensure it's ready)
    await facebookSdk.initialize(); // Ensure this is safe to call multiple times or check status
    if (!window.FB || typeof window.FB.login !== 'function') {
      throw new Error('Facebook SDK failed to initialize.');
    }

    // 4. Call FB.login with correct params
    console.log('Starting Facebook Business Login for integration...');
    const response = await facebookSdk.login({
        config_id: facebookConfigId,
        response_type: 'code', // Explicitly request code
        scope: 'whatsapp_business_messaging,whatsapp_business_management,business_management,email,public_profile', // FULL scope
        state: state // Pass the generated state
        // redirect_uri: '...' // Usually NOT needed with JS SDK; handled by app config
    });

    console.log('Facebook login response:', response);

    // --- Handle Response (Code Flow Only) ---
    if (response.authResponse?.code) {
        const code = response.authResponse.code;
        console.log('Received authorization code. Sending to backend callback...');

        try {
            // 5. Send Code and State to Backend Callback
            // Construct URL like /auth/facebook/callback?code=...&state=...
            const callbackUrl = endpoints.facebookCallback(code, state);
            const backendResponse = await http.get(callbackUrl); // Use GET for the callback

            // 6. Handle Backend Response (Simple Success/Failure)
            if (backendResponse.data?.success) {
                toast.add({
                    color: 'success',
                    title: translator('system.common.success'),
                    description: translator('integrations.facebook.linkSuccess') // e.g., "WhatsApp Business account linked successfully."
                });
                // Optional: Refresh page data or redirect within integrations section
                // router.push('/integrations?refresh=true'); // Example
            } else {
                 // Backend indicated failure
                throw new Error(backendResponse.data?.message || translator('integrations.facebook.linkError'));
            }
        } catch (callbackError: any) {
            console.error('Error during backend callback processing:', callbackError.response?.data || callbackError.message);
            toast.add({
                color: 'error',
                title: translator('system.common.error'),
                description: callbackError.response?.data?.message || translator('integrations.facebook.linkError') // Show specific error from backend if available
            });
        }

    } else {
        // Handle cases where login wasn't successful or didn't return a code
        // (e.g., user cancelled, no authResponse)
        console.error('Facebook login did not return an authorization code:', response);
        // Don't log user out, just inform them the connection failed
        toast.add({
          color: 'warning', // Or 'error' depending on cause
          title: translator('auth.login.warningTitle'), // Use appropriate title
          description: translator('integrations.facebook.authorizationFailed') // e.g., "Authorization failed or was cancelled."
        });
    }

  } catch (error: any) {
     // Catch errors from SDK init, FB.login, etc.
    console.error('Error during Facebook integration initiation:', error);
    toast.add({
      color: 'error',
      title: translator('system.common.error'),
      description: error.message || translator('integrations.facebook.initiationError')
    });
  }
};

export const receiveGoogleCallback = async (code: string, t?: TranslationFn): Promise<void> => {
  try {
    useUiStore().setSplashVisible(true);
    // get id token
    const response = await getHttp().get(getEndpoints().googleCallback(code));
    if (response.status !== HttpStatus.SUCCESS) throw new Error(getI18nMessageFromKey('auth.login.validationMessages.loginFailed', t));
    setToken(response.data.accessToken);
    getStore().setRefreshToken(response.data.refreshToken);
    decodeTokenAndSetUser();
    getStore().setSelectedForm(AuthForms.LOGIN);
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('auth.login.successTitle', t),
      description: getI18nMessageFromKey('auth.login.successMessage', t)
    });
    navigateTo('/');
  } catch (error: any) {
    logout();
    
    // Check for specific error case where account exists with email authentication
    if (error.response?.data?.message === 'User with this email exists with email authentication. Please login with your email and password.' && 
        error.response?.data?.auth_provider === 'email') {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('auth.login.errorTitle', t),
        description: `${getI18nMessageFromKey('auth.login.validationMessages.emailAuthExists', t)}. ${getI18nMessageFromKey('auth.login.validationMessages.useEmailToLogin', t)}`
      });
    } else {
      // General error case
      useToast().add({
        color: 'error',
        title: error.response?.data?.message || getI18nMessageFromKey('auth.login.errorTitle', t),
        description: getI18nMessageFromKey('auth.login.errorMessage', t)
      });
    }
    throw error;
  } finally {
    useUiStore().setSplashVisible(false);
  }
};

export const receiveFacebookCallback = async (token: string, t?: TranslationFn): Promise<void> => {
  try {
    // If we already have a token in the URL, we can use it directly
    if (token) {
      // Set the token and decode user information
      setToken(token);
      decodeTokenAndSetUser();
      
      // Get toast for notifications
      const toast = useToast();
      const { t: i18nT } = useI18n();
      const translator = t || i18nT;
      
      // Show success message
      toast.add({
        color: 'success',
        title: translator('auth.login.successTitle'),
        description: translator('auth.login.loginSuccess')
      });
      
      // Navigate to dashboard
      const router = useRouter();
      router.push('/dashboard');
      return;
    }
    
    // Get the code from URL if token is not available (should not happen with our implementation)
    const route = useRoute();
    const code = route.query.code as string;
    
    if (!code) {
      throw new Error('No authentication code or token found in URL');
    }
    
    // Exchange code for token
    const http = getHttp();
    const endpoints = useNuxtApp().$endpoints;
    const response = await http.get(endpoints.facebookCallback(code));
    
    if (response.data && response.data.accessToken) {
      setToken(response.data.accessToken);
      decodeTokenAndSetUser();
      
      // Get toast for notifications
      const toast = useToast();
      const { t: i18nT } = useI18n();
      const translator = t || i18nT;
      
      // Show success message
      toast.add({
        color: 'success',
        title: translator('auth.login.successTitle'),
        description: translator('auth.login.loginSuccess')
      });
      
      // Navigate to dashboard
      const router = useRouter();
      router.push('/dashboard');
    } else {
      throw new Error('No access token received from server');
    }
  } catch (error: any) {
    console.error('Error in Facebook callback:', error);
    
    // Cleanup in case of error
    logout();
    
    // Show error notification
    const toast = useToast();
    const { t: i18nT } = useI18n();
    const translator = t || i18nT;
    
    toast.add({
      color: 'error',
      title: translator('auth.login.errorTitle'),
      description: translator('auth.login.facebookCallbackError')
    });
    
    // Navigate back to login
    const router = useRouter();
    router.push('/login');
  }
};

// Export initialization function instead of running it at module level
export const initAuth = (): void => {
  try {
    const store = getStore();
    store.loadToken();
    
    if (hasExpiredToken()) {
      logout();
      return;
    }
    
    decodeTokenAndSetUser();
  } catch (error) {
    console.error('Error initializing auth service:', error);
  }
};