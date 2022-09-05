import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../components/pages/HomePage.vue";
import LoginPage from "../components/pages/LoginPage.vue";
import ProfileEditPage from "../components/pages/ProfileEditPage.vue";
import { supabase } from "@/services/supabase";
import EventEditPage from "../components/pages/EventEditPage.vue";
import EventCreatePage from "../components/pages/EventCreatePage.vue";
import MatchesPage from "@/components/pages/MatchesPage.vue";
import LoginCallbackPage from "../components/pages/LoginCallbackPage.vue";
import EventPage from "@/components/pages/EventPage.vue";
import EventSearchPage from "@/components/pages/EventSearchPage.vue";
import EventDashboard from "@/components/pages/EventDashboard.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/about",
      component: () => import("../components/pages/AboutPage.vue"), // lazy-loading
    },
    {
      path: "/legal",
      component: () => import("../components/pages/LegalPage.vue"), // lazy-loading
    },
    {
      path: "/",
      component: HomePage,
      meta: { requiresLogin: true, requiresCompletedProfile: true },
    },
    {
      path: "/edit-profile",
      component: ProfileEditPage,
      meta: { requiresLogin: true },
    },
    {
      path: "/create-event",
      component: EventCreatePage,
      meta: { requiresLogin: true, requiresCompletedProfile: true },
    },
    {
      path: "/matches",
      component: MatchesPage,
      meta: { requiresLogin: true, requiresCompletedProfile: true },
    },
    {
      path: "/edit-event/:id",
      component: EventEditPage,
      meta: { requiresLogin: true, requiresCompletedProfile: true },
    },
    {
      path: "/events",
      component: EventSearchPage,
    },
    {
      path: "/events/:id/dashboard",
      component: EventDashboard,
      name: "dashboard",
      meta: { requiresLogin: true },
    },
    {
      path: "/events/:id",
      component: EventPage,
      name: "event-detail",
    },

    // TODO: Better supabase callback handling https://github.com/JMaylor/vuepabase/blob/5e5668af6b4430a0c6dc7f6b72b38f885de2d2de/src/router.ts#L51
    // not sure if /callback is the correct route though ^
    {
      path: "/callback",
      component: LoginCallbackPage,
    },
  ],
});

// Check requirements to enter a route
router.beforeEach((to, _from, next) => {
  // requiresLogin
  const loggedIn = supabase.auth.user();
  if (to.matched.some((record) => record.meta.requiresLogin) && !loggedIn) {
    console.warn(
      "tried to access",
      to.fullPath,
      "but not logged in, forwarding to /login"
    );
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }

  // requiresCompletedProfile
  // TODO: We have a race condition here, because isRegistered isn't set at the beginning. It's basically async.
  const registered = useAuthStore().isRegistered;
  if (
    to.matched.some((record) => record.meta.requiresCompletedProfile) &&
    loggedIn &&
    !registered
  ) {
    console.warn(
      "tried to access",
      to.fullPath,
      "but not registered, forwarding to /edit-profile"
    );
    next({ path: "/edit-profile", query: { redirect: to.fullPath } });
    return;
  }
  next();
});

export default router;
