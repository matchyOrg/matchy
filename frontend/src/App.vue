<script setup lang="ts">
import { RouterView } from "vue-router";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";
import TheNavBar from "./components/TheNavBar.vue";
import TheSideBar from "./components/TheSideBar.vue";

const userStore = useUserStore();

userStore.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  userStore.user = session?.user ?? null;
});

const sideBarVisible = ref(false);
</script>

<template>
  <TheNavBar @toggle-side-bar="sideBarVisible = !sideBarVisible" />
  <div class="content">
    <RouterView />
    <TheSideBar :visible="sideBarVisible" @update:visible="(value) => (sideBarVisible = value)" />
  </div>
</template>

<style scoped>
.content {
  overflow-y: scroll;
}
</style>
