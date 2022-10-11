import { createRouter, createWebHistory } from "vue-router";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import HomePage from "@/components/pages/HomePage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import LoginPage from "@/components/pages/LoginPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import ProfileEditPage from "@/components/pages/ProfileEditPage.vue";
import { supabase } from "@/services/supabase";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import EventEditPage from "@/components/pages/EventEditPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import EventCreatePage from "@/components/pages/EventCreatePage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import MatchesPage from "@/components/pages/MatchesPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import LoginCallbackPage from "@/components/pages/LoginCallbackPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import EventPage from "@/components/pages/EventPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import EventSearchPage from "@/components/pages/EventSearchPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import EventDashboard from "@/components/pages/EventDashboard.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import SignUpPage from "@/components/pages/SignUpPage.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import ForgotPassword from "@/components/pages/ForgotPassword.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import ResetPassword from "@/components/pages/ResetPassword.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import CurrentParticipantEventPage from "@/components/pages/CurrentParticipantEventPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/signup",
      component: SignUpPage,
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/reset-password",
      component: ResetPassword,
    },
    {
      path: "/",
      component: HomePage,
      meta: { requiresLogin: true },
    },
    {
      path: "/edit-profile",
      component: ProfileEditPage,
      meta: { requiresLogin: true },
    },
    {
      path: "/create-event",
      component: EventCreatePage,
      meta: { requiresLogin: true },
    },
    {
      path: "/matches",
      component: MatchesPage,
      meta: { requiresLogin: true },
    },
    {
      path: "/edit-event/:id",
      component: EventEditPage,
      meta: { requiresLogin: true },
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
      path: "/events/:id/participant",
      component: CurrentParticipantEventPage,
      name: "participant",
      meta: { requiresLogin: true },
    },
    {
      path: "/events/:id",
      component: EventPage,
      name: "event-detail",
    },
    {
      path: "/callback",
      component: LoginCallbackPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, _from, next) => {
  // requiresLogin
  const loggedIn = supabase.auth.user();
  if (to.meta.requiresLogin && !loggedIn) {
    console.warn(
      "tried to access",
      to.fullPath,
      "but not logged in, forwarding to /login"
    );
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
