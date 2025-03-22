import * as authService from '~/services/auth.service';
import { getUserProfile, updateProfile, initProfileService } from '~/services/profile.service';
import { initVersionService, useVersionService } from '~/services/version.service';

export default defineNuxtPlugin((nuxtApp) => {
    // Call the initialization functions once the app is mounted
    nuxtApp.hook('app:mounted', () => {
        authService.initAuth();
        initProfileService();
        initVersionService();
    });
    
    return {
        provide: {
            authService,
            profileService: {
                getUserProfile,
                updateProfile
            },
            versionService: useVersionService()
        },
    };
});