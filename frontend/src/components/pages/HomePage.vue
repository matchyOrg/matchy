<template>
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
    <div v-if="PageMode === 'organizer'"></div>
  </v-main>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/currentEvent";
import { PageMode } from "@/stores/pageMode";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const currentEventStore = useCurrentEventStore();

const firstName = authStore.profile.fullName?.split(" ")[0];

// TODO: Handle the error login case
// http://127.0.0.1:5173/#/error=unauthorized_client&error_code=401&error_description=Email+link+is+invalid+or+has+expired
</script>
