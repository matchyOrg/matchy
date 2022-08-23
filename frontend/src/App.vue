<template>
  <!-- only show nav if logged in and registered -->
  <v-app>
    <TheNavBar
      v-if="authStore.user && authStore.isRegistered"
      @toggle-side-bar="sideBarVisible = !sideBarVisible"
    />
    <TheSideBar
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
import { useTheme } from "vuetify/lib/framework.mjs";

// Used to communicate betweeen TheNavBar and TheSideBar
const sideBarVisible = ref(false);

const authStore = useAuthStore();
</script>
