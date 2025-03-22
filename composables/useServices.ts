// No need to import a type since we're using the actual functions
export const useAuthService = () => {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$authService;
}
