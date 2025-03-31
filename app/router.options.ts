import type { RouterConfig } from "@nuxt/schema";

export default {
    routes: (_routes) => [
        {
            name: "home",
            path: "/",
            component: () => import("~/pages/home.vue"),
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
            name: "inbox",
            path: "/inbox",
            component: () => import("~/pages/inbox/index.vue"),
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
            name: "whatsapp-account-new",
            path: "/integrations/whatsapp/new",
            component: () => import("~/pages/integrations/whatsapp/new.vue"),
        },
        {
            name: "whatsapp-inbox",
            path: "/integrations/whatsapp/inbox",
            component: () => import("~/pages/integrations/whatsapp/inbox.vue"),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        // Scroll to top on navigation
        return savedPosition || { top: 0 };
    },
} satisfies RouterConfig;