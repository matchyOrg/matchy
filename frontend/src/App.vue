<template>
  <v-app class="application" full-height>
    <RouterView />
    <bottom-nav-bar v-if="authStore.user" />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore(); // update store on init
const router = useRouter();

watch(
  () => authStore.user,
  () => {
    if (authStore.user === null) {
      router.push("/login");
    }
  },
  { immediate: true }
);
</script>

<style>
.application {
  margin: 0 auto;
  max-width: 435px;
}

html {
  background-color: #f6f6f6;
}

.v-main {
  margin-right: 20px;
  margin-left: 20px;
}

/* chrome browser's 'autofill' fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>
