<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
watch(
  () => authStore.user,
  (user) => {
    if (user !== null) {
      router.push(authStore.redirect);
    }
  }
);
</script>
<template>Logging in...</template>
