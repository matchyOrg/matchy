<template>
  <teleport to="#nav-right">
    <v-icon v-if="authStore.user?.id == matchyEvent?.organizer"
      >mdi-pencil</v-icon
    >
  </teleport>
  <v-main>
    <v-container>
      <h2 v-if="!loadingEvent">{{ matchyEvent?.title }}</h2>
      <skeleton-loader v-else width="200" height="32" />
      <v-card
        class="mt-4 mb-3 pa-4 font-weight-bold"
        width="100%"
        height="200"
        color="#E0E0E0"
        elevation="0"
        >Replace this with an actual placeholder in case no thumbnail is
        available
        <v-img
          cover
          class="mb-3"
          width="100%"
          v-if="matchyEvent?.header_image"
          :src="matchyEvent?.header_image"
      /></v-card>

      <div class="mb-3 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-marker</v-icon
        >
        <span v-if="!loadingEvent">{{ matchyEvent?.location }}</span>
        <skeleton-loader v-else width="200" />
      </div>
      <div class="mb-4 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-calendar</v-icon
        >
        <span v-if="!loadingEvent">
          {{ matchyEvent?.datetime.day }}/{{ matchyEvent?.datetime.month }}/{{
            matchyEvent?.datetime.year
          }}
        </span>
        <skeleton-loader v-else width="200" />
      </div>
      <div class="mb-4 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-clock</v-icon
        >
        <span v-if="!loadingEvent"
          >{{ matchyEvent?.datetime.hour }}:{{
            matchyEvent?.datetime.minute
          }}</span
        >
        <skeleton-loader v-else width="200" />
      </div>
      <p v-if="!loadingEvent" class="my-8">{{ matchyEvent?.description }}</p>

      <skeleton-loader v-else width="100%" :num-rows="2" />
      <v-divider class="mt-4" />
      <div v-if="matchyEvent?.event_groups">
        <span class="d-block mb-4"
          >There are 2 types of participants in this event:</span
        >
      </div>
      <v-btn class="d-block mx-auto mt-8 mb-1 font-weight-bold" height="52">
        <v-icon class="mr-2" size="large">mdi-share-variant</v-icon>
        Share this event
      </v-btn>
      <span class="d-block text-center text-grey text-caption">{{
        PageMode === "organizer"
          ? "Invite participants by sharing this link with them"
          : "Share this invite link with friends!"
      }}</span>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { type EventInfo, useEventService } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
import { PageMode } from "@/stores/pageMode";

const authStore = useAuthStore();
const eventService = useEventService(authStore);
const route = useRoute();
const router = useRouter();

const matchyEvent = ref<EventInfo>();
const loadingEvent = ref(true);

watch(
  () => route.params.id,
  async () => {
    if (isNaN(+route.params.id)) {
      errorToast("Uh oh, looks like that is not a valid event id");
      router.back();
    }
    try {
      matchyEvent.value = await eventService.fetchEventById(+route.params.id);
    } catch (e) {
      errorToast(
        "The event could not be loaded... Going back to previous page."
      );
      router.back();
    }
    loadingEvent.value = false;
  },
  { immediate: true }
);
</script>
