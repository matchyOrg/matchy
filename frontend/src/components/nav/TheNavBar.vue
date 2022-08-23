<template>
  <v-app-bar app @click-right="goToProfile" z-index="3">
    <v-app-bar-nav-icon @click="openSideBar"></v-app-bar-nav-icon>
    <!-- <template #right>
      <van-icon name="user-circle-o" />
    </template> -->
  </v-app-bar>
</template>

<script setup lang="ts">
const router = useRouter();

const emits = defineEmits<{
  (e: "toggleSideBar"): void;
}>();

function openSideBar() {
  emits("toggleSideBar");
}

function goToProfile() {
  router.push("/edit-profile");
}
</script>
