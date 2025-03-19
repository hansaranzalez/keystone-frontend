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
      const token = store.token;
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
