
import { AuthService } from '~/services/auth.service';

export default defineNuxtPlugin((nuxtApp) => {
    const authService = new AuthService();
    return {
        provide: {
            authService,
        },
    };
});