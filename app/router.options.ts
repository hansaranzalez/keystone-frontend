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
            name: "profile",
            path: "/account",
            component: () => import("~/pages/account.vue"),
        }
    ],
} satisfies RouterConfig;