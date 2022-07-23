<template>
  <!-- only show nav if logged in -->
  <div v-if="userStore.user">
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

// update user in store on authStateChange
const userStore = useUserStore();
userStore.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  userStore.user = session?.user ?? null;
});
</script>
