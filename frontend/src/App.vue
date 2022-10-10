<template>
  <v-app class="application" full-height>
    <RouterView />
    <bottom-nav-bar v-if="authStore.user" />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore(); // updates store on init
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
/* mobile breakpoint variables */
:root {
  /* chrome */
  --mobile-s: 320px;
  --mobile-m: 375px;
  --mobile-l: 435px;

  /* vuetify */
  --material-xs: 600px;
  --material-sm: 960px;

  /* tailwind css */
  --sm: 640px;
  --md: 768px;
}
.application {
  margin: 0 auto;
  /* not resposive - mobile only */
  max-width: var(--mobile-l);
}

.v-main {
  margin-right: 20px;
  margin-left: 20px;
}
</style>
