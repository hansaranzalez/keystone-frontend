import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Pinia } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useHttp } from '~/composables/useHttp';
import { AuthUser } from '~/models/entities/AuthUser';
import { AuthForms, useAuthStore } from '~/store/authStore';
import { useUiStore } from '~/store/ui.store';
import { HttpStatus } from '~/types/auth.type';

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
      throw new Error(getI18nMessageFromKey('registration.errors.registrationFailed', t));
    }
    
    setToken(response.data.accessToken);
    decodeTokenAndSetUser();
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('registration.successTitle', t),
      description: getI18nMessageFromKey('registration.registrationSuccess', t)
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
        title: getI18nMessageFromKey('registration.errorTitle', t),
        description: `${getI18nMessageFromKey('registration.errors.googleAuthExists', t)}. ${getI18nMessageFromKey('registration.errors.useGoogleToLogin', t)}`
      });
    } else if (error.response?.data?.message === 'User with this email already exists with email' && 
              error.response?.data?.auth_provider === 'email') {
      // Email auth error
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('registration.errorTitle', t),
        description: `${getI18nMessageFromKey('registration.errors.emailAuthExists', t)}. ${getI18nMessageFromKey('registration.errors.useEmailToLogin', t)}`
      });
    } else {
      // General registration error
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('registration.errorTitle', t),
        description: getI18nMessageFromKey('registration.errors.registrationFailed', t)
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
      throw new Error(getI18nMessageFromKey('passwordChange.errorMessage', t));
    }
    
    // Save the email for subsequent code verification step
    getStore().setCatchedEmail(email);
    
    // Show success message using backend's message if available
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('passwordChange.successTitle', t),
      description: response.data?.message || getI18nMessageFromKey('passwordChange.successMessage', t)
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
        title: getI18nMessageFromKey('passwordChange.errorTitle', t),
        description: getI18nMessageFromKey('passwordChange.socialAccountError', t) || 
                    'Password change is not available for social media accounts. Please use social login.'
      });
    } else {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('passwordChange.errorTitle', t),
        description: error.response?.data?.message || getI18nMessageFromKey('passwordChange.errorMessage', t)
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
      throw new Error(getI18nMessageFromKey('changePassword.validationMessages.missingToken', t));
    }
    
    if (!email) {
      throw new Error(getI18nMessageFromKey('changePassword.errorMessage', t) || 'Email is missing');
    }
    
    const response = await getHttp().post(getEndpoints().changePassword, {
      email,
      code,
      newPassword,
    });
    
    if (response.status !== HttpStatus.SUCCESS) {
      throw new Error(getI18nMessageFromKey('changePassword.errorMessage', t));
    }
    
    // Show success message
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('changePassword.successTitle', t),
      description: getI18nMessageFromKey('changePassword.successMessage', t)
    });
    
    // Navigate to password change success screen
    store.setSelectedForm(AuthForms.PASSWORD_RESET_SUCCESS);
    
    // Clear the stored verification code and email
    store.setChangePasswordCode('' as any);
    store.setCatchedEmail('' as any);
  } catch (error: any) {
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('changePassword.errorTitle', t),
      description: error.message || getI18nMessageFromKey('changePassword.errorMessage', t)
    });
    throw error;
  }
};

export const verifyActivationCode = async (code: string, t?: TranslationFn): Promise<any> => {
  try {
    const response = await getHttp().post(getEndpoints().verifyActivationCode, {
      code,
    });
    
    if (response.status !== HttpStatus.SUCCESS) throw new Error(t('activatePassword.errorMessage'));
    
    return response.data;
  } catch (error) {
    useToast().add({
      color: 'error',
      title: t('common.error'),
      description: t('activatePassword.errorMessage')
    });
    throw error;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string, t?: TranslationFn): Promise<{ success: boolean }> => {
  try {
    const store = getStore();
    const token = store.token;
    
    if (!token) throw new Error(getI18nMessageFromKey('common.unauthorized', t));

    const response = await getHttp().post(getEndpoints().updatePassword, {
      currentPassword,
      newPassword
    });
    
    if (response.status !== HttpStatus.SUCCESS) {
      throw new Error(response.data?.message || getI18nMessageFromKey('passwordChange.errorMessage', t));
    }
    
    return { success: true };
  } catch (error: any) {
    // Handle specific error responses from the backend
    let errorMessage = getI18nMessageFromKey('passwordChange.errorMessage', t);
    
    // Extract error message from response if available
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Look for specific error messages and translate them if needed
    if (errorMessage.includes('incorrect')) {
      errorMessage = getI18nMessageFromKey('passwordChange.incorrectCurrentPassword', t) || 'Current password is incorrect';
    } else if (errorMessage.includes('Google authentication')) {
      errorMessage = getI18nMessageFromKey('passwordChange.googleAuthError', t) || 'Cannot change password for accounts that use Google authentication exclusively';
    } else if (errorMessage.includes('at least 8 characters')) {
      errorMessage = getI18nMessageFromKey('passwordChange.passwordTooShort', t) || 'New password must be at least 8 characters long';
    }
    
    useToast().add({
      color: 'error',
      title: getI18nMessageFromKey('common.error', t),
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
      throw new Error(getI18nMessageFromKey('changePassword.errorMessage', t) || 'Email is missing');
    }
    
    const response = await getHttp().post(getEndpoints().verifyPasswordResetCode, {
      email,
      code,
    });
    
    if (response.status !== HttpStatus.SUCCESS) throw new Error(getI18nMessageFromKey('changePassword.errorMessage', t));
    
    getStore().setChangePasswordCode(response.data.code);
    return response.data;
  } catch (error: any) {
    // Check specifically for invalid verification code error
    const errorMessage = error.response?.data?.message;
    if (errorMessage === "The verification code is invalid") {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('common.error', t),
        description: getI18nMessageFromKey('changePassword.validationMessages.invalidResetCode', t) || "The verification code is invalid. Please check and try again."
      });
    } else {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('common.error', t),
        description: errorMessage || getI18nMessageFromKey('changePassword.validationMessages.invalidResetCode', t)
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
      title: getI18nMessageFromKey('login.errorTitle', t),
      description: getI18nMessageFromKey('login.errorMessage', t)
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

export const initFacebookLoginFlow = async (deps: FacebookLoginDeps): Promise<void> => {
  const { toast, translator, endpoints, router, facebookSdk, facebookConfigId } = deps;
  
  // Handle the auth code from Facebook
  const handleFacebookCode = async (code: string) => {
    try {
      const http = getHttp();
      const response = await http.get(endpoints.facebookCallback(code));
      
      if (response.data && response.data.accessToken) {
        setToken(response.data.accessToken);
        decodeTokenAndSetUser();
        toast.add({
          color: 'success',
          title: translator('login.successTitle'),
          description: translator('login.loginSuccess')
        });
        router.push('/dashboard');
      } else {
        // Handle missing token
        toast.add({
          color: 'error',
          title: translator('login.errorTitle'),
          description: translator('login.errorMessage')
        });
      }
      
    } catch (error: any) {
      logout();
      
      // Check for email auth provider error
      if (error.response?.data?.message === 'User with this email exists with email authentication. Please login with your email and password.' && 
          error.response?.data?.auth_provider === 'email') {
        toast.add({
          color: 'error',
          title: translator('login.errorTitle'),
          description: `${translator('login.validationMessages.emailAuthExists')}. ${translator('login.validationMessages.useEmailToLogin')}`
        });
      } else {
        // General error case
        toast.add({
          color: 'error',
          title: translator('login.errorTitle'),
          description: translator('login.errorMessage')
        });
      }
    }
  };
  
  try {
    // Ensure Facebook SDK is initialized
    if (!facebookSdk) {
      toast.add({
        color: 'error',
        title: translator('login.errorTitle'),
        description: translator('login.facebookSdkUnavailable')
      });
      return;
    }
    
    // Start Facebook login process
    const response = await facebookSdk.login({
      config_id: facebookConfigId,
      scope: 'email,public_profile',
      redirect_uri: 'https://localhost:3001/auth/facebook/callback',
    });
    
    // Log the response to understand the structure
    console.log('Facebook login response:', response);
    
    if (response.authResponse) {
      // Facebook might return an access token instead of a code
      // We'll handle both cases
      if (response.authResponse.accessToken) {
        // We have a token directly from Facebook
        // Send it to our backend for validation
        try {
          const http = getHttp();
          const backendResponse = await http.post(endpoints.facebookLogin, {
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          });
          
          if (backendResponse.data && backendResponse.data.accessToken) {
            setToken(backendResponse.data.accessToken);
            decodeTokenAndSetUser();
            toast.add({
              color: 'success',
              title: translator('login.successTitle'),
              description: translator('login.loginSuccess')
            });
            router.push('/dashboard');
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          console.error('Error processing Facebook token:', error);
          toast.add({
            color: 'error',
            title: translator('login.errorTitle'),
            description: translator('login.facebookLoginError')
          });
        }
      } else if (response.authResponse.code) {
        // We have an auth code, send it to the backend
        await handleFacebookCode(response.authResponse.code);
      } else {
        console.error('Facebook login successful but no token or code received:', response);
        toast.add({
          color: 'error',
          title: translator('login.errorTitle'),
          description: translator('login.facebookLoginError')
        });
      }
    } else {
      console.error('Facebook login response has no authResponse:', response);
      toast.add({
        color: 'error',
        title: translator('login.errorTitle'),
        description: translator('login.facebookLoginError')
      });
    }
  } catch (error: any) {
    if (error.message === 'Facebook login failed') {
      // User cancelled or did not authorize
      toast.add({
        color: 'warning',
        title: translator('login.warningTitle'),
        description: translator('login.facebookNotAuthorized')
      });
    } else {
      console.error('Error during Facebook login:', error);
      toast.add({
        color: 'error',
        title: translator('login.errorTitle'),
        description: translator('login.facebookLoginError')
      });
    }
  }
};

export const receiveGoogleCallback = async (code: string, t?: TranslationFn): Promise<void> => {
  try {
    useUiStore().setSplashVisible(true);
    // get id token
    const response = await getHttp().get(getEndpoints().googleCallback(code));
    if (response.status !== HttpStatus.SUCCESS) throw new Error(getI18nMessageFromKey('login.validationMessages.loginFailed', t));
    setToken(response.data.accessToken);
    getStore().setRefreshToken(response.data.refreshToken);
    decodeTokenAndSetUser();
    getStore().setSelectedForm(AuthForms.LOGIN);
    useToast().add({
      color: 'success',
      title: getI18nMessageFromKey('login.successTitle', t),
      description: getI18nMessageFromKey('login.successMessage', t)
    });
    navigateTo('/');
  } catch (error: any) {
    logout();
    
    // Check for specific error case where account exists with email authentication
    if (error.response?.data?.message === 'User with this email exists with email authentication. Please login with your email and password.' && 
        error.response?.data?.auth_provider === 'email') {
      useToast().add({
        color: 'error',
        title: getI18nMessageFromKey('login.errorTitle', t),
        description: `${getI18nMessageFromKey('login.validationMessages.emailAuthExists', t)}. ${getI18nMessageFromKey('login.validationMessages.useEmailToLogin', t)}`
      });
    } else {
      // General error case
      useToast().add({
        color: 'error',
        title: error.response?.data?.message || getI18nMessageFromKey('login.errorTitle', t),
        description: getI18nMessageFromKey('login.errorMessage', t)
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
        title: translator('login.successTitle'),
        description: translator('login.loginSuccess')
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
        title: translator('login.successTitle'),
        description: translator('login.loginSuccess')
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
      title: translator('login.errorTitle'),
      description: translator('login.facebookCallbackError')
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