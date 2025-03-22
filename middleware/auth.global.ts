import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  // Public routes that don't require authentication
  if (to.path === '/' || to.path === '/auth/google/callback' || to.path === '/login') {
    return true;
  }
  
  const authStore = useAuthStore();
  
  // We should only proceed if either:
  // 1. The user is authenticated in the store, OR
  // 2. There's a valid token in localStorage
  // This ensures proper handling during page reloads
  // isAuthenticated now checks both in-memory state and localStorage token
  // This ensures authentication persists across page reloads
  if (!authStore.isAuthenticated) {
    return abortNavigation();
  }
  
  return true;
});