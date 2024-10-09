import { createWebHistory, createRouter } from "vue-router";

import BookList from "@/views/BookList.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import CartList from "@/views/CartList.vue";
import AccountList from "@/views/AccountList.vue";
const routes = [
    {
        path: "/",
        name: "book",
        component: BookList,
    },
    {
        path: "/cart",
        name: "cart",
        component: CartList,
        props: true
    },
    {
        path: "/account",
        name: "account",
        component: AccountList ,
        props: true
    },
    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
