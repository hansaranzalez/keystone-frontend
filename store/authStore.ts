// stores/authStore.ts
import { defineStore } from "pinia";
import { useCookies } from '@vueuse/integrations/useCookies'
import { AuthUser } from "~/models/entities/AuthUser";

export enum AuthForms {
  LOGIN = 1,
  REGISTRATION = 2,
  REQUEST_PASSWORD_RESET = 3,
  RESET_PASSWORD = 4,
  ACTIVATE_PASSWORD_RESET = 5,
  PASSWORD_RESET_SUCCESS = 6,
  REQUEST_PASSWORD_RESET_SUCCESS = 7,
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  selectedForm: AuthForms;
  catchedEmail: string | null;
  changePasswordCode: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    selectedForm: AuthForms.LOGIN,
    catchedEmail: null,
    changePasswordCode: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    // Check both state and localStorage to ensure authentication persists across reloads
    isAuthenticated: (state): boolean => !!state.token || !!localStorage.getItem("authToken"),
    userGetter: (state): AuthUser | null => state.user,
    selectedFormGetter: (state): AuthForms => state.selectedForm,
    catchedEmailGetter: (state): string | null => state.catchedEmail,
    changePasswordCodeGetter: (state): string | null => state.changePasswordCode,
    
    // Additional useful getters
    isAdmin(): boolean {
      return this.user?.isAdmin() ?? false;
    },
    
    isVerified(): boolean {
      return this.user?.hasVerifiedEmail() ?? false;
    },

    isActive(): boolean {
      return this.user?.isActiveUser() ?? false;
    },

    hasSocialAuth(): boolean {
      return this.user?.hasSocialAuth() ?? false;
    }
  },

  actions: {
    // Loading and error management
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    // Token management
    setToken(token: string) {
      this.token = token;
      // Use localStorage for persistence across page reloads
      localStorage.setItem("authToken", token);
    },

    loadToken() {
      // Load token from localStorage for persistence across page reloads
      const token = localStorage.getItem("authToken");
      if (token) {
        this.token = token;
        return true;
      }
      return false;
    },

    setRefreshToken(token: string) {
      const cookies = useCookies();
      cookies.set("refreshToken", token);
    },

    // User management
    setUser(userData: any) {
      this.user = AuthUser.Build(userData);
    },

    updateUser(userData: Partial<AuthUser>) {
      if (this.user) {
        const updatedData = { ...this.user.toJSON(), ...userData };
        this.user = AuthUser.Build(updatedData);
      }
    },

    // Auth form management
    setSelectedForm(form: AuthForms) {
      this.selectedForm = form;
    },

    // Email management
    setCatchedEmail(email: string) {
      this.catchedEmail = email;
    },

    clearCatchedEmail() {
      this.catchedEmail = null;
    },

    // Password reset management
    setChangePasswordCode(code: string) {
      this.changePasswordCode = code;
    },

    // Session management
    logout() {
      const cookies = useCookies();
      this.token = null;
      this.user = null;
      
      // Clear cookies
      cookies.remove("refreshToken");
      cookies.remove("authToken");
      
      // Clear localStorage to ensure token is removed
      localStorage.removeItem("authToken");
      
      this.$reset();
    },

    // Profile updates
    // async updateProfile(profileData: Partial<AuthUser>) {
    //   this.setLoading(true);
    //   try {
    //     const profileService = useProfileService();
    //     await profileService.updateProfile(profileData);
    //     this.updateUser(profileData);
    //   } catch (error: any) {
    //     this.setError(error.message);
    //     throw error;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },

    async updateProfileImage(imageUrl: string) {
      this.updateUser({ profile_image_url: imageUrl });
    },

    // Reset store state
    $reset() {
      this.user = null;
      this.token = null;
      this.selectedForm = AuthForms.LOGIN;
      this.catchedEmail = null;
      this.changePasswordCode = null;
      this.isLoading = false;
      this.error = null;
    },
  },
});