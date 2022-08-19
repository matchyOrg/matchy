<template>
  <!-- only show nav if logged in -->
  <div v-if="userStore.user && userStore.isRegistered">
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
import { useUserStore } from "@/stores/user";

// Used to communicate betweeen TheNavBar and TheSideBar
const sideBarVisible = ref(false);

const userStore = useUserStore();
</script>
