<template>
  <teleport to="#nav-title">🐱 Matchy</teleport>
  <v-main class="mx-5">
    <h2 class="my-7 text-grey font-weight-regular">Hey {{ firstName }}!</h2>

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
        :to="'/events/' + e.id"
        @share="share(e)"
      >
        <v-card-actions class="d-flex justify-center mh-0">
          <v-btn
            color="primary"
            size="small"
            @click.prevent="confirmPresence"
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
            color="primary"
            size="small"
            :to="'/events/' + e.id + '/dashboard'"
            >{{ t("pages.home.active-event-action") }}</v-btn
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
  </v-main>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/currentEvent";
import { PageMode } from "@/stores/pageMode";
import { useAuthStore } from "@/stores/auth";
import { useEventService, type EventInfo } from "@/services/eventService";
import { Temporal } from "@js-temporal/polyfill";
import { shareEvent } from "@/services/utils/share";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { isValidCurrentEvent } from "@/stores/utils/currentEventUtil";

const { t } = useI18n();
const authStore = useAuthStore();
const currentEventStore = useCurrentEventStore();

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
  // events that have started at most 30 minutes ago or will start in 30 minutes at the earlist
  currentEvents.value = allEvents.filter((e) => {
    const diff = Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()).since(
      e.datetime
    );
    return diff.abs().total({ unit: "hour" }) <= 1;
  });

  // all other events
  // this is inefficient, but people probably won't be registered for many events anyways
  // and very unlikely to more than 1 at the same time
  futureEvents.value = allEvents.filter((e) =>
    currentEvents.value.every((ce) => ce.id !== e.id)
  );
};

watch(() => PageMode.value, fetchEvents, { immediate: true });

const share = async (e: EventInfo) =>
  await shareEvent(e, PageMode.value, authStore);

const confirmPresence = () => {
  console.log("Don't care, didn't ask");
};
</script>

<style scoped>
.mh-0 {
  min-height: 0;
}
</style>
