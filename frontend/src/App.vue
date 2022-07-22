<script setup lang="ts">
import { RouterView } from "vue-router";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";
import NavBar from "./components/NavBar.vue";

const userStore = useUserStore();

userStore.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  userStore.user = session?.user ?? null;
});
</script>

<template>
  <NavBar />
  <RouterView />
</template>
