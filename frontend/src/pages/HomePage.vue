<template>
  <before-login v-if="!userStore.user"></before-login>
  <div v-else>Logged in</div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import BeforeLogin from "../components/BeforeLogin.vue";

const userStore = useUserStore();
</script>
