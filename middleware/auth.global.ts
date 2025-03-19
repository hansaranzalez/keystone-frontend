import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/' || to.path === '/auth/google/callback') {
    return true
  }
  if (!useAuthStore().isAuthenticated) {
    return abortNavigation()
  }
  return true;
});