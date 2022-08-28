<template>
  <teleport to="#nav-right">
    <v-icon v-if="authStore.user?.id == matchyEvent?.organizer" @click="onEdit"
      >mdi-pencil</v-icon
    >
  </teleport>
  <v-main>
    <v-container>
      <h2 v-if="!loadingEvent">{{ matchyEvent?.title }}</h2>
      <skeleton-loader v-else width="200" height="32" />
      <v-card
        class="mt-4 mb-3 font-weight-bold"
        width="100%"
        height="200"
        color="#E0E0E0"
        elevation="0"
      >
        <v-img
          cover
          width="100%"
          v-if="matchyEvent?.header_image"
          :src="imageHeaderSrc"
        />
        <span v-else class="pa-4">
          Replace this with an actual placeholder in case no thumbnail is
          available
        </span>
      </v-card>

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
          {{ matchyEvent?.datetime.day }}/{{
            String(matchyEvent?.datetime.month).padStart(2, "0")
          }}/{{ matchyEvent?.datetime.year }}
        </span>
        <skeleton-loader v-else width="200" />
      </div>
      <div class="mb-4 d-flex align-center">
        <v-icon class="mr-4" size="small" color="grey-darken-2"
          >mdi-clock</v-icon
        >
        <span v-if="!loadingEvent"
          >{{ String(matchyEvent?.datetime.hour).padStart(2, "0") }}:{{
            String(matchyEvent?.datetime.minute).padStart(2, "0")
          }}</span
        >
        <skeleton-loader v-else width="200" />
      </div>
      <p v-if="!loadingEvent" class="my-8">{{ matchyEvent?.description }}</p>

      <skeleton-loader v-else width="100%" :num-rows="2" />
      <v-divider class="mt-4" />
      <div v-if="matchyEvent?.event_groups">
        <span class="d-block mb-4">{{ t("pages.events.groups-text") }}:</span>
      </div>
      <v-btn
        class="d-block mx-auto mt-8 mb-1 font-weight-bold"
        height="52"
        @click="onShare"
      >
        <v-icon class="mr-2" size="large">mdi-share-variant</v-icon>
        {{ t("pages.events.share-button-text") }}
      </v-btn>
      <span class="d-block text-center text-grey text-caption">{{
        PageMode === "organizer"
          ? t("pages.events.share-hint-organizer")
          : t("pages.events.share-hint-participant")
      }}</span>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { type EventInfo, useEventService } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
import { PageMode } from "@/stores/pageMode";
import { shareEvent } from "@/services/utils/share";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();
const eventService = useEventService(authStore);
const route = useRoute();
const router = useRouter();

const matchyEvent = ref<EventInfo>();
const loadingEvent = ref(true);

const imageHeaderSrc = computed(
  () =>
    import.meta.env.VITE_SUPABASE_STORAGE_URL +
    "event-header-images/" +
    matchyEvent.value?.header_image
);

const onShare = async () => {
  if (!matchyEvent.value) {
    throw new Error("Event shared before loaded");
  }
  await shareEvent(matchyEvent.value, PageMode.value, authStore);
};

const onEdit = () => {
  router.push("/edit-event/" + route.params.id);
};

watch(
  () => route.params.id,
  async () => {
    if (isNaN(+route.params.id)) {
      errorToast(t("pages.events.invalid-id"));
      router.back();
      return;
    }
    try {
      matchyEvent.value = await eventService.fetchEventById(+route.params.id);
    } catch (e) {
      errorToast(t("pages.events.event-load-error"));
      router.back();
    }
    loadingEvent.value = false;
  },
  { immediate: true, flush: "post" }
);
</script>
