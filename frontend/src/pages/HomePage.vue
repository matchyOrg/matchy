<template>
  <before-login v-if="!userStore.user"></before-login>
  <div v-else>
    <h2>Welcome {{ t("mode." + PageMode) }} {{ userStore.profile.username }}</h2>
    <div v-if="PageMode === 'user'">
      <p v-if="!currentEventStore.hasEvent">Sign up for an event by ...</p>
      <!--TODO: Navigate to current event-->
      <router-link :to="''" v-else>Click here to go to your current event</router-link>
    </div>
    <div v-if="PageMode === 'organizer'"></div>
  </div>
</template>
<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/current-event";
import { PageMode } from "@/stores/page-mode";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import BeforeLogin from "../components/BeforeLogin.vue";
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const currentEventStore = useCurrentEventStore();

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
