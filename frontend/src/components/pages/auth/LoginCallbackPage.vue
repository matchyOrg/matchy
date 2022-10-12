<!-- MVP APPROVED BY @SUESZLI -->
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
      console.log("Login callback, redirecting to", redirect);
      router.push(redirect);
    }
  },
  { immediate: true }
);
</script>
<template>Logging in...</template>
