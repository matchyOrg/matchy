<template>
  Page for creating/editing events. It'll edit an event if one is specified in
  the URL.

  <EditEvent v-model="event" />
</template>

<script setup lang="ts">
import EditEvent from "@/components/EditEvent.vue";
import type { EditEventInfo } from "@/services/events";
import { Temporal } from "@js-temporal/polyfill";

const event = ref<EditEventInfo>({
  title: "",
  description: "",
  datetime: Temporal.Now.zonedDateTimeISO(),
  location: "",
  max_participants: 20,
  uses_groups: true,
  event_groups: {
    groupA: {
      title: "Male",
      description: "",
    },
    groupB: {
      title: "Male",
      description: "",
    },
  },
});
</script>
