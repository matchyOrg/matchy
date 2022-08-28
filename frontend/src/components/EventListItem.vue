<template>
  <v-card :to="to" elevation="4">
    <v-card-title
      class="event-title d-flex justify-space-between py-4 pr-4 text-body-2 font-weight-bold"
    >
      <span class="d-block mr-4 text-wrap">{{ matchyEvent.title }}</span>
      <v-icon> mdi-share-variant </v-icon>
    </v-card-title>
    <v-img
      v-if="matchyEvent.header_image && showImage"
      :src="headerImageSrc"
      width="100%"
      height="200"
      cover
    />
    <slot />
  </v-card>
</template>

<script lang="ts" setup>
import type { EventInfo } from "@/services/eventService";

const props = withDefaults(
  defineProps<{ matchyEvent: EventInfo; showImage?: boolean; to?: string }>(),
  { showImage: false }
);

const headerImageSrc = computed(
  () =>
    import.meta.env.VITE_SUPABASE_STORAGE_URL +
    "event-header-images/" +
    props.matchyEvent.header_image
);
</script>

<style>
.event-title {
    line-height: 20px !important;
}
</style>