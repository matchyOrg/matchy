<template>
  <h2>Welcome, {{ userStore.profile.username }}!</h2>
  <h6 style="margin-top: -1rem">Current view: {{ t("mode." + PageMode) }}</h6>

  <!-- Visitor view -->
  <div v-if="PageMode === 'eventVisitor'">
    <p v-if="!currentEventStore.hasEvent">Sign up for an event by ...</p>
    <!--TODO: Forward to current event, if running -->
    <router-link :to="''" v-else>Click here to go to your current event</router-link>
  </div>

  <!-- Organizer view -->
  <div v-if="PageMode === 'eventOrganizer'">
  </div>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/current-event";
import { PageMode } from "@/stores/page-mode";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
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
        // On first visit of home page, the user is required to fill out their profile
        // TODO: check whether _all_ the user attributes are empty - user could close app mid way through signup
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
