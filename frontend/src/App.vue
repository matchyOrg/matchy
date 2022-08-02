<template>
  <!-- only show nav if logged in -->
  <div v-if="userStore.user && userStore.isRegistered">
    <TheNavBar @toggle-side-bar="sideBarVisible = !sideBarVisible" />
    <TheSideBar :visible="sideBarVisible" @update:visible="(value) => (sideBarVisible = value)" />
  </div>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";
import TheNavBar from "./components/TheNavBar.vue";
import TheSideBar from "./components/TheSideBar.vue";

// Used to communicate betweeen TheNavBar and TheSideBar
const sideBarVisible = ref(false);

// update "user" when the auth state changes
const userStore = useUserStore();
userStore.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  const newState = session?.user ?? null;
  console.log("auth state changed, updating user to: ", newState);
  userStore.user = newState;
});

// update "profile" when "user" changes
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      console.log("user changed, updating profile. isLoggedIn = ", isLoggedIn, " -> therefore fetching profile");
      userStore.fetchProfile();
    } else {
      console.log("user changed, updating profile. isLoggedIn = ", isLoggedIn, " -> therefore clearing profile");
      userStore.clearProfile();
    }
  },
  { immediate: true }
);
</script>
