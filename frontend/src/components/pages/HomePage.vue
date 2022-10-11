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
      <div
        v-if="currentUserEvents.length > 0"
        class="text-h6 font-weight-bold mb-4"
      >
        {{ t("pages.home.confirm-presence-header") }}
      </div>
      <event-list-item
        class="mb-4"
        v-for="(e, i) in currentUserEvents"
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
            >{{ t("pages.home.to-action") }}</v-btn
          >
          <v-btn
            v-else
            color="primary"
            @click.prevent="confirmPresence(e.id)"
            >{{ t("pages.home.confirm-presence-action") }}</v-btn
          >
        </v-card-actions>
      </event-list-item>
      <v-spacer />
      <div class="text-h6 font-weight-bold mb-4">
        {{ t("pages.home.future-events-header") }}
      </div>
      <template v-if="futureUserEvents.length > 0">
        <event-list-item
          class="mb-4"
          v-for="(e, i) in futureUserEvents"
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

      <!-- Organiser events: -->
      <div
        v-if="currentOrganizerEvents.length > 0"
        class="text-h6 font-weight-bold mb-4"
      >
        {{ t("pages.home.active-event") }}
      </div>
      <event-list-item
        class="mb-4"
        v-for="(e, i) in currentOrganizerEvents"
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
            >{{ t("pages.home.active-event-action") }}</v-btn
          >
          <v-btn v-else color="primary" @click.prevent="startEvent(e.id)"
            >Start Event</v-btn
          >
        </v-card-actions>
      </event-list-item>
      <v-spacer />
      <div class="text-h6 font-weight-bold mb-4">
        {{ t("pages.home.future-events-header") }}
      </div>
      <template v-if="futureOrganizerEvents.length > 0">
        <event-list-item
          class="mb-4"
          v-for="(e, i) in futureOrganizerEvents"
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
    </v-container>
  </v-main>
  <v-footer class="d-flex justify-center pb-4">
    <!-- other links -->
    <a
      href="https://github.com/matchyOrg/.github/blob/main/profile/README.md"
      class="mx-4 text-grey"
    >
      {{ t("pages.login.footer-about-us") }}
    </a>
    <a
      href="https://github.com/matchyOrg/matchy/blob/main/TERMS.md"
      class="mx-4 text-grey"
    >
      {{ t("pages.login.footer-legal-notice") }}
    </a>
  </v-footer>
</template>

<script setup lang="ts">
import { useCurrentEventStore } from "@/stores/currentEvent";
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

const currentUserEvents = ref<EventInfo[]>([]);
const futureUserEvents = ref<EventInfo[]>([]);
const currentOrganizerEvents = ref<EventInfo[]>([]);
const futureOrganizerEvents = ref<EventInfo[]>([]);

function groupCurrentAndFutureEvents(events: EventInfo[]) {
  // events with
  // datetime at most 30 minutes ago
  // or in 30 minutes at the earliest
  // or have started but not ended
  const current = events.filter((e) => {
    const diff = Temporal.Now.instant().since(e.datetime);
    return (
      diff.abs().total({ unit: "hour" }) <= 1 || (e.is_started && !e.is_ended)
    );
  });

  // all other events
  // this is inefficient, but people probably won't be registered for many events anyways
  // and very unlikely to more than 1 at the same time
  const future = events.filter((e) => current.every((ce) => ce.id !== e.id));

  return { current, future };
}

const fetchEvents = async () => {
  const participatingEvents = await eventService.fetchUserEvents();
  ({ current: currentUserEvents.value, future: futureUserEvents.value } =
    groupCurrentAndFutureEvents(participatingEvents));

  const organizingEvents = await eventService.fetchOrganizerEvents();
  ({
    current: currentOrganizerEvents.value,
    future: futureOrganizerEvents.value,
  } = groupCurrentAndFutureEvents(organizingEvents));
};

fetchEvents();

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
