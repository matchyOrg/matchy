<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="emits('toggleSideBar')"></v-app-bar-nav-icon>
    <!-- <template #right>
      <van-icon name="user-circle-o" />
    </template> -->
  </v-app-bar>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: "toggleSideBar"): void;
}>();
</script>
