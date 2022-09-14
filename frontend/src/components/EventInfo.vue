<template>
  <div class="mb-4 d-flex align-center" v-if="loading || location">
    <v-icon class="mr-4" size="small" color="grey-darken-2"
      >mdi-map-marker</v-icon
    >
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="location">{{ location }}</span>
  </div>
  <div class="mb-4 d-flex align-center" v-if="loading || datetime">
    <v-icon class="mr-4" size="small" color="grey-darken-2"
      >mdi-calendar</v-icon
    >
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="datetime">
      {{ String(datetime.day).padStart(2, "0") }}/{{
        String(datetime.month).padStart(2, "0")
      }}/{{ datetime.year }}
    </span>
  </div>
  <div class="mb-4 d-flex align-center" v-if="loading || datetime">
    <v-icon class="mr-4" size="small" color="grey-darken-2">mdi-clock</v-icon>
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="datetime"
      >{{ String(datetime.hour).padStart(2, "0") }}:{{
        String(datetime.minute).padStart(2, "0")
      }}</span
    >
  </div>
</template>

<script lang="ts" setup>
import type { Temporal } from "@js-temporal/polyfill";

const props = defineProps<{
  loading: boolean;
  location: string;
  datetime: Temporal.ZonedDateTime;
}>();
</script>
