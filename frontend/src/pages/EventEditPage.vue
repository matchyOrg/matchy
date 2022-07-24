<template>
  Page for creating/editing events. It'll edit an event if one is specified in the URL.

  <EditEvent v-model="event" />
</template>

<script setup lang="ts">
import EditEvent from "@/components/EditEvent.vue";
import type { EditEventInfo } from "@/services/events";
import { Temporal } from "@js-temporal/polyfill";

const event = ref<EditEventInfo>({
  title: "",
  description: "",
  date_time: Temporal.Now.zonedDateTimeISO(),
  event_location: "",
});
</script>
