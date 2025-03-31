// plugins/http.client.ts
import axios from 'axios'
import { useAuthStore } from '~/store/authStore'

export default defineNuxtPlugin((nuxtApp) => {
  // Create an Axios instance
  const http = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor to attach auth token
  http.interceptors.request.use((config) => {
    let token = null
    
    // Get auth token from store if available
    try {
      const authStore = useAuthStore()
      if (authStore && authStore.token) {
        token = authStore.token
      }
    } catch (error) {
      console.warn('Auth store not available for token retrieval:', error)
    }
    
    // Fallback to localStorage if needed
    if (!token && process.client) {
      token = localStorage.getItem('authToken')
    }
    
    // Set auth header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  })

  // Response interceptor for error handling
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 unauthorized by redirecting to login
      if (error.response?.status === 401) {
        // Only redirect if not already on login page
        const currentPath = window.location.pathname
        if (!currentPath.includes('/login') && !currentPath.includes('/reset-password')) {
          navigateTo('/login')
        }
      }
      return Promise.reject(error)
    }
  )

  // Provide http to the app
  nuxtApp.provide('http', http)
})
