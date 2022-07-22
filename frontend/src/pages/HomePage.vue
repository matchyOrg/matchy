<template>
  <before-login v-if="!userStore.user"></before-login>
  <div v-else>Logged in</div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import BeforeLogin from "../components/BeforeLogin.vue";

const router = useRouter();
const userStore = useUserStore();

// TODO: Handle the error login case
// http://127.0.0.1:5173/#/error=unauthorized_client&error_code=401&error_description=Email+link+is+invalid+or+has+expired

watch(
  () => userStore.isLoggedIn,
  (v) => {
    if (v) {
      userStore.loadProfile().then(() => {
        const profileIsEmpty = userStore.isLoggedIn && userStore.profile.username === "";
        if (profileIsEmpty) {
          router.push("/profile-edit");
        }
      });
    }
  },
  { immediate: true }
);
</script>
