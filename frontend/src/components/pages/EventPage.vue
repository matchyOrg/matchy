<template>
  <teleport to="#nav-right">
    <v-icon
      v-if="
        PageMode === 'organizer' && authStore.user?.id == matchyEvent?.organizer
      "
      @click="onEdit"
      >mdi-pencil</v-icon
    >
  </teleport>
  <v-main>
    <v-container>
      <h2 v-if="!loadingEvent">{{ matchyEvent?.title }}</h2>
      <skeleton-loader v-else width="200" height="32" />
      <v-card
        class="mb-3 font-weight-bold"
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
      <p v-if="!loadingEvent" class="mt-8">{{ matchyEvent?.description }}</p>

      <skeleton-loader v-else width="100%" :num-rows="2" />
      <v-divider class="my-4" />
      <div v-if="matchyEvent?.event_groups">
        <span class="d-block mb-4">{{ t("pages.events.groups-text") }}:</span>
        <span class="d-block font-weight-bold">{{
          matchyEvent.event_groups.groupA.title
        }}</span>
        <span
          class="d-block pl-4 mb-4"
          v-if="matchyEvent.event_groups.groupA.description"
          >{{ matchyEvent.event_groups.groupA.description }}</span
        >
        <span class="d-block pl-4 mb-4 text-grey" v-else>{{
          t("shared.events.no-description")
        }}</span>
        <span class="d-block font-weight-bold">{{
          matchyEvent.event_groups.groupB.title
        }}</span>
        <span
          class="d-block pl-4 mb-4"
          v-if="matchyEvent.event_groups.groupB.description"
          >{{ matchyEvent.event_groups.groupB.description }}</span
        >
        <span class="d-block pl-4 mb-4 text-grey" v-else>{{
          t("shared.events.no-description")
        }}</span>
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
        PageMode === "organizer" &&
        authStore.user &&
        authStore.user.id === matchyEvent?.organizer
          ? t("pages.events.share-hint-organizer")
          : t("pages.events.share-hint-participant")
      }}</span>
      <div class="d-flex justify-center mt-8">
        <v-progress-circular indeterminate v-if="loadingRegisteredStatus" />
        <span v-else-if="isRegisteredForEvent" class="d-block">
          <v-icon class="mr-2" color="success">mdi-check-bold</v-icon>
          {{ t("pages.events.already-registered") }}
        </span>
        <v-btn
          v-else-if="!authStore.isLoggedIn"
          variant="text"
          color="primary"
          @click="router.push('/login?redirect=/events/' + matchyEvent?.id)"
          >{{ t("pages.events.login-register") }}</v-btn
        >
        <v-btn
          v-else-if="
            authStore.user?.id && authStore.user.id !== matchyEvent?.organizer
          "
          variant="text"
          color="primary"
          @click="startRegister"
          >{{ t("pages.events.register-button-text") }}
          <v-dialog v-model="showRegisterModal">
            <v-card>
              <v-card-title class="text-h6">{{
                t("pages.events.register-modal-title")
              }}</v-card-title>
              <v-card-text>
                {{ t("pages.events.register-modal-text") }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="registerForEvent(matchyEvent?.event_groups?.groupA)"
                >
                  {{ matchyEvent?.event_groups?.groupA.title }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="registerForEvent(matchyEvent?.event_groups?.groupB)"
                >
                  {{ matchyEvent?.event_groups?.groupB.title }}
                </v-btn>
              </v-card-actions>
            </v-card></v-dialog
          >
        </v-btn>
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import {
  type EventInfo,
  type Group,
  useEventService,
} from "@/services/eventService";
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
const loadingRegisteredStatus = ref(true);
const isRegisteredForEvent = ref<boolean>();

const showRegisterModal = ref(false);

const imageHeaderSrc = computed(
  () =>
    import.meta.env.VITE_SUPABASE_STORAGE_URL + matchyEvent.value?.header_image
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

// entry-point for both registrations
const startRegister = async () => {
  // if the event uses groups we show a modal for the user to pick one
  if (matchyEvent.value?.event_groups) {
    showRegisterModal.value = true;
    return;
  }
  await registerForEvent();
};

const registerForEvent = async (group?: Group) => {
  if (!matchyEvent.value) return;
  await eventService.registerForEvent(matchyEvent.value.id, group?.id);
  successToast(t("pages.events.register-without-group-success"));
  showRegisterModal.value = false;
  isRegisteredForEvent.value = true;
};

watch(
  () => route.params.id,
  async () => {
    loadingEvent.value = true;
    loadingRegisteredStatus.value = true;
    if (isNaN(+route.params.id)) {
      errorToast(t("shared.events.invalid-id"));
      router.back();
      return;
    }
    try {
      matchyEvent.value = await eventService.fetchEventById(+route.params.id);
    } catch (e) {
      console.log(e);
      errorToast(t("shared.events.event-load-error"));
      router.back();
    }
    loadingEvent.value = false;
    try {
      isRegisteredForEvent.value = await eventService.isRegisteredForEvent(
        +route.params.id
      );
    } catch (e) {
      console.log(e);
    }
    loadingRegisteredStatus.value = false;
  },
  { immediate: true, flush: "post" }
);
</script>
