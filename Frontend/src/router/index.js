import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../views/Landing.vue")},
        { path: "/home", component: () => import("../views/Home.vue")},
        { path: "/login", component: () => import("../views/Login.vue")},
        { path: "/register", component: () => import("../views/Register.vue")},
        { path: "/profile", component: () => import("../views/profile/Profile.vue")},
        { path: "/chat", component: () => import("../views/chat.vue")},
        { path: "/quiz", component: () => import("../views/Quiz.vue")},
        { path: "/matches", component: () => import("../views/Matches.vue")},
        { path: "/gallery", component: () => import("../views/gallery/gallery.vue")},
    ],
});

export default router;