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
  max-width: 437px;
}

html {
  background-color: #f6f6f6;
}

@font-face {
  font-family: "unviers";
  src: url("@/assets/universFont/universltstd-obl-webfont.woff2")
    format("woff2");
}
@font-face {
  font-family: "univers-light";
  src: url("@/assets/universFont/universltstd-light-webfont.woff2")
    format("woff2");
}
@font-face {
  font-family: "univers-light-cursive";
  src: url("@/assets/universFont/universltstd-lightobl-webfont.woff2")
    format("woff2");
}
@font-face {
  font-family: "univers-bold-wide";
  src: url("@/assets/universFont/universltstd-webfont.woff2") format("woff2");
}

* {
  font-family: "univers", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
}

/* chrome browser's 'autofill' fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>
