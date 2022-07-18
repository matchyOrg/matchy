import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../components/views/HomeView.vue";

// TODO: require auth https://github.com/stefnotch/sepm-project/blob/main/src/router/index.ts
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // lazy-loading: only load when route is visited
      component: () => import("../components/views/AboutView.vue"),
    },
  ],
});

export default router;
