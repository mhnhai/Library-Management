import { createWebHistory, createRouter } from "vue-router";

import Client from "@/views/Client.vue";
import NotFound from "@/views/NotFound.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import BookDetails from "@/views/BookDetails.vue";
import Account from "@/views/Account.vue"
import Borrow from "@/views/Borrow.vue"
import History from "@/views/History.vue";
import AboutPage from "@/views/AboutPage.vue";
import Contact from "@/views/Contact.vue";
import ChangePassword from "@/views/ChangePassword.vue";
const routes = [
    {
        path: "/",
        name: "client",
        component: Client,
    },
    {
        path: "/book/:id",
        name: "bookdetails",
        component: BookDetails,
        props: true
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: NotFound,
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
        path: "/account/:id",
        name: "account",
        component: Account,
        props: true
    },
    {
        path: "/change-pw/:id",
        name: "change-pw",
        component: ChangePassword,
        props: true
    },
    {
        path: "/cart",
        name: "cart",
        component: Borrow,
        props: true
    },
    {
        path: "/history/:id",
        name: "history",
        component: History,
        props: true,
    },
    {
        path: "/about",
        name: "about",
        component: AboutPage,
    },
    {
        path: "/contact",
        name: "contact",
        component: Contact,
    },
    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
