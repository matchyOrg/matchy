import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";

// TODO: require auth https://github.com/stefnotch/sepm-project/blob/main/src/router/index.ts
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/signup",
      component: SignUpPage,
    },
    {
      path: "/about",
      // lazy-loading: only load when route is visited
      component: () => import("../pages/AboutPage.vue"),
    },
  ],
});

export default router;
