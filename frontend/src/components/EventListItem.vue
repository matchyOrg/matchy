<template>
  <v-card :to="to" elevation="4">
    <v-card-title
      class="event-title d-flex justify-space-between align-center py-4 pr-4 text-body-1 font-weight-bold"
    >
      <span class="d-block mr-4 text-wrap">{{ matchyEvent.title }}</span>
      <v-btn variant="text" icon="mdi-share-variant" @click.prevent="share" />
    </v-card-title>
    <v-img
      v-if="matchyEvent.header_image && showImage"
      :src="headerImageSrc"
      width="100%"
      height="200"
      cover
    />
    <div class="info my-2 mx-4" v-if="showInfo">
      <div class="mb-3 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-marker</v-icon
        >
        <span>{{ matchyEvent?.location }}</span>
      </div>
      <div class="mb-4 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-calendar</v-icon
        >
        <span>
          {{ matchyEvent?.datetime.day }}/{{
            String(matchyEvent?.datetime.month).padStart(2, "0")
          }}/{{ matchyEvent?.datetime.year }}
        </span>
      </div>
      <div class="mb-4 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-clock</v-icon
        >
        <span
          >{{ String(matchyEvent?.datetime.hour).padStart(2, "0") }}:{{
            String(matchyEvent?.datetime.minute).padStart(2, "0")
          }}</span
        >
      </div>
    </div>
    <slot />
  </v-card>
</template>

<script lang="ts" setup>
import type { EventInfo } from "@/services/eventService";

const props = withDefaults(
  defineProps<{
    matchyEvent: EventInfo;
    showImage?: boolean;
    showInfo?: boolean;
    to?: string;
  }>(),
  { showImage: false, showInfo: false }
);

const emits = defineEmits<{
  (e: "share"): void;
}>();

const share = () => emits("share");

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
