import { createWebHistory, createRouter } from "vue-router";

import Admin from "@/views/Admin.vue";
import BookAdd from "@/views/BookAdd.vue";
import BookEdit from "@/views/BookEdit.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import CartList from "@/views/CartList.vue";
import AccountList from "@/views/AccountList.vue";
const routes = [
    {
        path: "/",
        name: "admin",
        component: Admin,
    },
    {
        path: "/books/:id",
        name: "book.edit",
        component: BookEdit,
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/admin/books/add",
        name: "book.add",
        component: BookAdd,
        props: true
    },
    {
        path: "/signin",
        name: "signin",
        component: SignIn,
        props: true
    },
    {
        path: "/signup",
        name: "signup",
        component: SignUp,
        props: true
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
