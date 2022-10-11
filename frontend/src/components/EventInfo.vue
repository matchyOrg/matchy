<template>
  <div class="mb-4 d-flex align-center" v-if="loading || location">
    <v-icon class="mr-4" size="small" color="grey-darken-2"
      >mdi-map-marker</v-icon
    >
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="location">{{ location }}</span>
  </div>
  <div class="mb-4 d-flex align-center" v-if="loading || datetimeToDisplay">
    <v-icon class="mr-4" size="small" color="grey-darken-2"
      >mdi-calendar</v-icon
    >
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="datetimeToDisplay">
      {{ String(datetimeToDisplay.day).padStart(2, "0") }}/{{
        String(datetimeToDisplay.month).padStart(2, "0")
      }}/{{ datetimeToDisplay.year }}
    </span>
  </div>
  <div class="mb-4 d-flex align-center" v-if="loading || datetimeToDisplay">
    <v-icon class="mr-4" size="small" color="grey-darken-2">mdi-clock</v-icon>
    <skeleton-loader v-if="loading" width="200" />
    <span v-else-if="datetimeToDisplay">
      {{ String(datetimeToDisplay.hour).padStart(2, "0") }}
      :{{ String(datetimeToDisplay.minute).padStart(2, "0") }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { instantToZonedDateTime } from "@/services/utils/datetime";
import type { Temporal } from "@js-temporal/polyfill";

const props = defineProps<{
  loading: boolean;
  location: string;
  datetime: Temporal.Instant;
}>();

const datetimeToDisplay = computed(() => {
  return instantToZonedDateTime(props.datetime);
});
</script>
