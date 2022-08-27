<template>
  <teleport to="#nav-title">Create Event</teleport>
  <v-main>
    <v-container>
      <edit-event v-model="matchyEvent" />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import type { EditEventInfo } from "@/services/eventService";
import { Temporal } from "@js-temporal/polyfill";

const matchyEvent = reactive({
  title: "",
  description: "",
  header_image: undefined,
  max_participants: 50,
  datetime: Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()),
  location: "",
  uses_groups: true,
  event_groups: {
    groupA: {
      title: "",
      description: "",
    },
    groupB: {
      title: "",
      description: "",
    },
  },
} as EditEventInfo);
</script>
