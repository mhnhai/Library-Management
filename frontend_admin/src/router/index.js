import { createWebHistory, createRouter } from "vue-router";

import AuthService from '@/services/auth.service.js';
import BookList from "@/views/BookList.vue";
import Login from "@/views/Login.vue"
import CartList from "@/views/CartList.vue";
import AccountList from "@/views/AccountList.vue";
import PublisherList from "@/views/PublisherList.vue";
const routes = [

    {
        path: '/',
        name: 'admin',
        component: BookList,
        meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/book",
        name: "book",
        component: BookList,
        meta: { requiresAuth: true},
    },
    {
        path: "/publisher",
        name: "publisher",
        component: PublisherList,
        meta: { requiresAuth: true},
    },
    {
        path: "/cart",
        name: "cart",
        component: CartList,
        meta: { requiresAuth: true},
    },
    {
        path: "/account",
        name: "account",
        component: AccountList ,
        meta: { requiresAuth: true},
    },
    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = AuthService.isLoggedIn();
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;
