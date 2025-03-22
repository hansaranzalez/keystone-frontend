// composables/useHttp.ts
import axios from "axios";
import { useAuthStore } from "~/store/authStore";

export const useHttp = () => {
  // const { locale } = i18n.global;
  const getStore = () => useAuthStore();

  // Create an Axios instance with a base URL
  const http = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Attach Authorization token to requests
  http.interceptors.request.use((config) => {
    if (import.meta.client) {
      const store = getStore();
      
      // First check the store for token (memory)
      let token = store.token;
      
      // If not in store, try to get from localStorage
      if (!token) {
        token = localStorage.getItem('authToken');
      }
      
      // Set Authorization header if we have a token from either source
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Attach locale to requests
  // http.interceptors.request.use((config) => {
  //   if (locale) {
  //     config.headers["Accept-Language"] = (locale as any).value;
  //   }
  //   return config;
  // });

  // Handle responses and errors
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Navigate to logout or re-login if unauthorized
        navigateTo("/logout");
      }
      return Promise.reject(error);
    }
  );

  return { http };
};
