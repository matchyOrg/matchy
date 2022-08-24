<template>
  <v-app>
    <!-- nav bar header -->
    <v-app-bar app v-if="authStore.user && authStore.isRegistered">
      <v-app-bar-nav-icon
        @click="sideBarVisible = !sideBarVisible"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <!-- side bar -->
    <SideBar
      v-if="authStore.user && authStore.isRegistered"
      :visible="sideBarVisible"
      @update:visible="(value) => (sideBarVisible = value)"
    />

    <!-- content -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const sideBarVisible = ref(false);

const authStore = useAuthStore();
</script>
