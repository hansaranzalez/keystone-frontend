import type { RouterConfig } from "@nuxt/schema";

export default {
    routes: (_routes) => [
        {
            name: "inbox",
            path: "/",
            component: () => import("~/pages/inbox/index.vue"),
        },
        {
            name: "logout",
            path: "/logout",
            component: () => import("~/pages/logout.vue"),
        },
        {
            name: "google-callback",
            path: "/auth/google/callback",
            component: () => import("~/pages/google-callback.vue"),
        },
        {
            name: "account",
            path: "/account",
            component: () => import("~/pages/account.vue"),
        },
        // Fallback route to handle direct URL access and page reloads
        {
            name: "reset-password",
            path: "/reset-password",
            component: () => import("~/pages/reset-password.vue"),
        },
       
        {
            name: "integrations",
            path: "/integrations",
            component: () => import("~/pages/integrations/index.vue"),
        },
        {
            name: "whatsapp-accounts",
            path: "/integrations/whatsapp",
            component: () => import("~/pages/integrations/whatsapp/index.vue"),
        },
        {
            name: "whatsapp-account-detail",
            path: "/integrations/whatsapp/:id",
            component: () => import("~/pages/integrations/whatsapp/[id].vue"),
        },
        {
            name: "property-form",
            path: "/property/new",
            component: () => import("~/pages/property/form.vue"),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        // Scroll to top on navigation
        return savedPosition || { top: 0 };
    },
} satisfies RouterConfig;