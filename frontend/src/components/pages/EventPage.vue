<template>
  A event ID lands in the URL and all info about the event should be displayed
  here. Also, if the user owns (aka has organized) the event, we should
  <ul>
    <li>in "user mode": show a "switch to organizer mode" button</li>
    <li>in "organizer mode": edit button and extra info</li>
  </ul>
</template>

<script setup lang="ts">
import { useEventService } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const eventService = useEventService(authStore);

const events = await eventService.fetchEvents();
console.log(events);
</script>
