<template>
  <v-app>
    <!-- nav bar header -->
    <v-app-bar app :model-value="!!authStore.user && authStore.isRegistered">
      <v-app-bar-nav-icon
        @click="sideBarVisible = !sideBarVisible"
      ></v-app-bar-nav-icon>
      <v-app-bar-title id="nav-title"></v-app-bar-title>
    </v-app-bar>

    <!-- side bar -->
    <SideBar
      v-if="authStore.user && authStore.isRegistered"
      :visible="sideBarVisible"
      @update:visible="(value) => (sideBarVisible = value)"
    />

    <!-- content -->
    <RouterView />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const sideBarVisible = ref(false);

// update auth state on app load
const authStore = useAuthStore();
</script>
