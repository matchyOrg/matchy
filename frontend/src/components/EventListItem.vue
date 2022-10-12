<template>
  <v-card :to="to" :class="{ pulse }" elevation="4">
    <header class="flex justify-between">
      <v-card-title
        class="flex align-center py-0 pr-4 text-body-1 font-weight-bold text-wrap"
      >
        <p style="max-width: 20rem" class="leading-tight">
          {{ matchyEvent.title }}
        </p>
      </v-card-title>
      <v-btn variant="text" icon="mdi-share-variant" @click.prevent="share" />
    </header>

    <v-img
      v-if="matchyEvent.header_image && showImage"
      :src="headerImageSrc"
      width="100%"
      height="200"
      cover
    />
    <div v-else class="w-10/12">
      <v-divider></v-divider>
    </div>

    <div class="mt-3 mx-4" v-if="showInfo">
      <event-info
        :loading="false"
        :location="matchyEvent.location ?? ''"
        :datetime="matchyEvent.datetime"
      />
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
    pulse?: boolean;
  }>(),
  { showImage: false, showInfo: false, pulse: false }
);

const emits = defineEmits<{
  (e: "share"): void;
}>();

const share = () => emits("share");

const headerImageSrc = computed(
  () =>
    import.meta.env.VITE_SUPABASE_STORAGE_URL + props.matchyEvent.header_image
);
</script>

<style scoped>
.pulse {
  position: relative;
}
.pulse:after,
.pulse:before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 25px;
  width: 25px;
  transform-origin: 0% 0%;
  transform: scale(0) translate(-50%, -50%);
  border-radius: 50%;
  background-color: #2196f3;
  z-index: -1;
}

@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(0) translate(-50%, -50%);
  }
  50% {
    opacity: 0;
    transform: scale(20) translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: scale(20) translate(-50%, -50%);
  }
}

.pulse::before {
  animation: 4s ease-out infinite pulse;
}

.pulse::after {
  animation: 4s ease-out 1s infinite pulse;
}
</style>
