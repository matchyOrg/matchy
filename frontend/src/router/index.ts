import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";

// TODO: require auth https://github.com/stefnotch/sepm-project/blob/main/src/router/index.ts
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/about",
      // lazy-loading: only load when route is visited
      component: () => import("../pages/AboutPage.vue"),
    },
    // TODO: Better supabase callback handling https://github.com/JMaylor/vuepabase/blob/5e5668af6b4430a0c6dc7f6b72b38f885de2d2de/src/router.ts#L51
    // not sure if /callback is the correct route though ^
  ],
});

export default router;
