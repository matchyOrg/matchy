<template>
  <v-main>
    <v-container>
      <page-title>Matchy</page-title>
      <h2
        class="my-7 text-grey font-weight-regular"
        v-if="authStore.isRegistered"
      >
        {{ t("pages.home.hello") }} {{ firstName }}!
      </h2>
      <div class="my-7 d-flex justify-center" v-else>
        <v-btn to="/edit-profile">
          {{ t("pages.home.finish-profile") }}
        </v-btn>
      </div>

      <!-- Participant view -->
      <div v-if="PageMode === 'participant'">
        <div
          v-if="currentEvents.length > 0"
          class="text-h6 font-weight-bold mb-4"
        >
          {{ t("pages.home.confirm-presence-header") }}
        </div>
        <event-list-item
          class="mb-4"
          v-for="(e, i) in currentEvents"
          :key="i"
          :matchy-event="e"
          show-image
          :pulse="e.id == +currentEventStore.getCurrentId()"
          :to="'/events/' + e.id"
          @share="share(e)"
        >
          <v-card-actions class="d-flex justify-center mh-0">
            <v-btn
              v-if="e.id == +currentEventStore.getCurrentId()"
              :to="'/events/' + e.id + '/participant'"
              color="primary"
              size="small"
              >To action</v-btn
            >
            <v-btn
              v-else
              color="primary"
              size="small"
              @click.prevent="confirmPresence(e.id)"
              >{{ t("pages.home.confirm-presence-action") }}</v-btn
            >
          </v-card-actions>
        </event-list-item>
        <v-spacer />
        <div class="text-h6 font-weight-bold mb-4">
          {{ t("pages.home.future-events-header") }}
        </div>
        <template v-if="futureEvents.length > 0">
          <event-list-item
            class="mb-4"
            v-for="(e, i) in futureEvents"
            :key="i"
            :matchy-event="e"
            show-info
            :to="'/events/' + e.id"
            @share="share(e)"
          />
        </template>
        <div v-else class="text-center text-grey">
          {{ t("pages.home.no-events") }}
          <br />
          <v-btn color="primary" variant="text" class="mx-auto" to="/events">{{
            t("pages.home.no-event-cta")
          }}</v-btn>
        </div>
      </div>
      <div v-else-if="PageMode === 'organizer'">
        <div
          v-if="currentEvents.length > 0"
          class="text-h6 font-weight-bold mb-4"
        >
          {{ t("pages.home.active-event") }}
        </div>
        <event-list-item
          class="mb-4"
          v-for="(e, i) in currentEvents"
          :key="i"
          :matchy-event="e"
          show-image
          :to="'/events/' + e.id"
          :pulse="e.id == +currentEventStore.getCurrentId()"
          @share="share(e)"
        >
          <v-card-actions class="d-flex justify-center mh-0">
            <v-btn
              v-if="e.id == +currentEventStore.getCurrentId()"
              :to="'/events/' + e.id + '/dashboard'"
              color="primary"
              size="small"
              >{{ t("pages.home.active-event-action") }}</v-btn
            >
            <v-btn
              v-else
              color="primary"
              size="small"
              @click.prevent="startEvent(e.id)"
              >Start Event</v-btn
            >
          </v-card-actions>
        </event-list-item>
        <v-spacer />
        <div class="text-h6 font-weight-bold mb-4">
          {{ t("pages.home.future-events-header") }}
        </div>
        <template v-if="futureEvents.length > 0">
          <event-list-item
            class="mb-4"
            v-for="(e, i) in futureEvents"
            :key="i"
            :matchy-event="e"
            show-info
            :to="'/events/' + e.id"
            @share="share(e)"
          />
        </template>
        <div v-else class="text-center text-grey">
          {{ t("pages.home.no-org-events") }}
          <v-btn
            color="primary"
            variant="text"
            class="mx-auto"
            to="/create-event"
          >
            {{ t("pages.home.no-org-events-cta") }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-main>
  <v-footer class="d-flex justify-center pb-4">
    <!-- other links -->
    <router-link to="/about" class="mx-4 text-grey">
      {{ t("pages.login.footer-about-us") }}
    </router-link>
    <router-link to="/legal" class="mx-4 text-grey">
      {{ t("pages.login.footer-legal-notice") }}
    </router-link>
  </v-footer>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/currentEvent";
import { PageMode } from "@/stores/pageMode";
import { useAuthStore } from "@/stores/auth";
import { useEventService, type EventInfo } from "@/services/eventService";
import { Temporal } from "@js-temporal/polyfill";
import { shareEvent } from "@/services/utils/share";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();
const currentEventStore = useCurrentEventStore();
const router = useRouter();

const firstName = computed(() => authStore.profile.fullName?.split(" ")[0]);

const eventService = useEventService(authStore);

const currentEvents = ref<EventInfo[]>([]);
const futureEvents = ref<EventInfo[]>([]);

let participantEvents: EventInfo[];
let organizerEvents: EventInfo[];

const fetchEvents = async () => {
  let allEvents;
  if (PageMode.value === "participant") {
    // prevent refetching
    participantEvents =
      participantEvents ?? (await eventService.fetchUserEvents());
    allEvents = participantEvents;
  } else {
    // prevent refetching
    organizerEvents =
      organizerEvents ?? (await eventService.fetchOrganizerEvents());
    allEvents = organizerEvents;
  }
  // events with
  // datetime at most 30 minutes ago
  // or in 30 minutes at the earliest
  // or have started but not ended
  currentEvents.value = allEvents.filter((e) => {
    const diff = Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()).since(
      e.datetime
    );
    return (
      diff.abs().total({ unit: "hour" }) <= 1 || (e.is_started && !e.is_ended)
    );
  });

  // all other events
  // this is inefficient, but people probably won't be registered for many events anyways
  // and very unlikely to more than 1 at the same time
  futureEvents.value = allEvents.filter((e) =>
    currentEvents.value.every((ce) => ce.id !== e.id)
  );
};

watch(() => PageMode.value, fetchEvents, { immediate: true });

const share = async (e: EventInfo) => await shareEvent(e, authStore, t, router);

const confirmPresence = async (id: number) => {
  console.log("Don't care, didn't ask");
  try {
    await currentEventStore.confirmPresence(id);
    successToast("Welcome to the event");
    router.push({ name: "participant-view", params: { id } });
  } catch (e) {
    errorToast(e);
  }
};

const startEvent = async (id: number) => {
  try {
    await currentEventStore.startEvent(id);
    router.push("/events/" + id + "/dashboard");
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};
</script>

<style scoped>
.mh-0 {
  min-height: 0;
}
</style>
