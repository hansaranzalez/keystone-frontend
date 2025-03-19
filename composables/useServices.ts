import type { AuthService } from "~/services/auth.service";

export const useAuthService = () => {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$authService as AuthService;
}
