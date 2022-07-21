<script setup lang="ts">
import { RouterView } from "vue-router";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

userStore.user = supabase.auth.user();
supabase.auth.onAuthStateChange((_, session) => {
  userStore.user = session?.user ?? null;
});
</script>

<template>
  <RouterView />
</template>
