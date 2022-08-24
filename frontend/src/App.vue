<template>
  <v-app>
    <!-- only show nav if logged in and registered -->
    <NavBar
      v-if="authStore.user && authStore.isRegistered"
      @toggle-side-bar="sideBarVisible = !sideBarVisible"
    />
    <SideBar
      v-if="authStore.user && authStore.isRegistered"
      :visible="sideBarVisible"
      @update:visible="(value) => (sideBarVisible = value)"
    />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

// Used to communicate betweeen NavBar and SideBar
const sideBarVisible = ref(false);

const authStore = useAuthStore();
</script>
