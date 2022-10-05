<template>
  <v-app class="application" full-height>
    <!--
    <v-app-bar app :model-value="!!authStore.user">
      <v-app-bar-nav-icon
        @click="sideBarVisible = !sideBarVisible"
      ></v-app-bar-nav-icon>
      <v-app-bar-title id="nav-title"></v-app-bar-title>
      <v-spacer />
      <div class="mr-4" id="nav-right"></div>
    </v-app-bar>
    <SideBar
      v-if="authStore.user"
      :visible="sideBarVisible"
      @update:visible="(value) => (sideBarVisible = value)"
    />-->
    <!-- content -->
    <RouterView />
    <bottom-nav-bar v-if="authStore.user" />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const sideBarVisible = ref(false);

// update auth state on app load
const authStore = useAuthStore();
const router = useRouter();

watch(
  () => authStore.user,
  () => {
    if (authStore.user === null) router.push("/login");
  }
);
</script>

<style>
.application {
  max-width: 435px;
  margin: 0 auto;
}
.v-main {
  margin-right: 20px;
  margin-left: 20px;
}
</style>
