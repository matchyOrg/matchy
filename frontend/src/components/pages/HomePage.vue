<template>
  <teleport to="#nav-title">🐱 Matchy</teleport>
  <v-main class="mx-5">
    <h2 class="mt-7 text-grey font-weight-regular">Hey {{ firstName }}!</h2>

    <!-- Participant view -->
    <div v-if="PageMode === 'participant'">
      <p v-if="!currentEventStore.hasEvent">Sign up for an event by ...</p>

      <!--TODO: Forward to current event, if running -->
      <router-link :to="''" v-else
        >Click here to go to your current event</router-link
      >
    </div>

    <!-- Organizer view -->
    <div v-if="PageMode === 'organizer'">
      <p>Create events by ...</p>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/currentEvent";
import { PageMode } from "@/stores/pageMode";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const currentEventStore = useCurrentEventStore();

const firstName = computed(() => authStore.profile.fullName?.split(" ")[0]);
</script>
