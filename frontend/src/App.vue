<template>
  <!-- only show nav if logged in and registered -->
  <div v-if="authStore.user && authStore.isRegistered">
    <TheNavBar @toggle-side-bar="sideBarVisible = !sideBarVisible" />
    <TheSideBar
      :visible="sideBarVisible"
      @update:visible="(value) => (sideBarVisible = value)"
    />
  </div>
  <div class="px-4">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { supabase } from "./services/supabase";

// Used to communicate betweeen TheNavBar and TheSideBar
const sideBarVisible = ref(false);

console.log("App is mounted");
const authStore = useAuthStore();
authStore.setUserStore(supabase.auth.user());
</script>
