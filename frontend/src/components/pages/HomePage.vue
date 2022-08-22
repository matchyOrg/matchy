<template>
  <h2 class="text-center color-blue">
    Welcome, {{ authStore.profile.fullName }}!
  </h2>
  <h6 style="margin-top: -1rem">Current view: {{ t("mode." + PageMode) }}</h6>

  <!-- Visitor view -->
  <div v-if="PageMode === 'participant'">
    <p v-if="!currentEventStore.hasEvent">Sign up for an event by ...</p>
    <!--TODO: Forward to current event, if running -->
    <router-link :to="''" v-else
      >Click here to go to your current event</router-link
    >
  </div>

  <!-- Organizer view -->
  <div v-if="PageMode === 'organizer'"></div>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/current-event";
import { PageMode } from "@/stores/page-mode";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const authStore = useAuthStore();
const currentEventStore = useCurrentEventStore();

// TODO: Handle the error login case
// http://127.0.0.1:5173/#/error=unauthorized_client&error_code=401&error_description=Email+link+is+invalid+or+has+expired
</script>
