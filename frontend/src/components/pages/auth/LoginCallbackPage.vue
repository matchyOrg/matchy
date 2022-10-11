<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const redirect = authStore.redirect;
authStore.redirect = "/";

watch(
  () => authStore.user,
  (user) => {
    if (user !== null) {
      router.push(redirect);
    }
  },
  { immediate: true }
);
</script>
<template>Logging in...</template>
