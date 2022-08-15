<template>
  <VanNavBar @click-left="openSideBar" @click-right="goToProfile" z-index="3">
    <template #left>
      <van-icon name="wap-nav" />
    </template>
    <!-- <template #right>
      <van-icon name="user-circle-o" />
    </template> -->
  </VanNavBar>
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
  router.push("/profile-edit");
}
</script>
