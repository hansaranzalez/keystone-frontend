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
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        // Scroll to top on navigation
        return savedPosition || { top: 0 };
    },
} satisfies RouterConfig;