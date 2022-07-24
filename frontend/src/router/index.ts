import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import ProfileEditPage from "../pages/ProfileEditPage.vue";
import { supabase } from "@/services/supabase";

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
      path: "/profile-edit",
      component: ProfileEditPage,
      meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const loggedIn = supabase.auth.user();
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    console.warn("not logged in");
    //showToast("Please log in!");
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }
  next();
});

export default router;
