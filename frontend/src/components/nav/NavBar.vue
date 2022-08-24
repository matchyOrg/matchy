<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="emits('toggleSideBar')"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script setup lang="ts">
// https://next.vuetifyjs.com/en/components/navigation-drawers/

const emits = defineEmits<{
  (e: "toggleSideBar"): void;
}>();
</script>
