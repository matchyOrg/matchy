<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <v-main>
    <v-container>
      <!-- Greeting -->
      <section>
        <h2
          v-if="authStore.isRegistered"
          class="mt-1 mb-6 text-grey font-weight-regular"
        >
          {{ t("pages.home.hello") }} {{ firstName }}!
        </h2>
        <div v-else class="mt-5 mb-8 flex justify-center">
          <div class="border-1 rounded-md border-neutral-300">
            <v-btn
              to="/edit-profile"
              size="large"
              variant="text"
              color="primary"
            >
              <span class="text-grey">
                {{ t("pages.home.finish-profile") }}
              </span>
            </v-btn>
          </div>
        </div>
      </section>

      <!-- Current user events -->
      <section v-if="userEvents.current.length > 0" class="mb-12">
        <page-title :is-subtitle="true">
          {{ t("pages.home.confirm-presence-header") }}
        </page-title>
        <event-list-item
          class="mb-4"
          v-for="(e, i) in userEvents.current"
          :key="i"
          :matchy-event="e"
          show-image
          :pulse="e.id == +currentEventStore.getCurrentId()"
          :to="'/events/' + e.id"
          @share="share(e)"
        >
          <v-card-actions class="d-flex justify-center min-h-0">
            <v-btn
              v-if="e.id == +currentEventStore.getCurrentId()"
              class="-mt-4"
              :to="'/events/' + e.id + '/participant'"
              color="primary"
              >{{ t("pages.home.to-action") }}</v-btn
            >
            <v-btn
              v-else
              class="-mt-4"
              color="primary"
              @click.prevent="confirmPresence(e.id)"
              >{{ t("pages.home.confirm-presence-action") }}</v-btn
            >
          </v-card-actions>
        </event-list-item>
      </section>

      <!-- Future user events -->
      <section class="mb-12">
        <header class="flex justify-between w-full">
          <page-title :is-subtitle="true">
            {{ t("pages.home.future-events-visiting-header") }}
          </page-title>
          <v-btn
            class="-mt-2.5 -mr-1"
            to="/events"
            color="primary"
            variant="text"
            :alt="t('pages.home.events')"
            icon="mdi-calendar-search-outline"
          />
        </header>
        <template v-if="userEvents.future.length > 0">
          <event-list-item
            class="mb-4"
            v-for="(e, i) in userEvents.future"
            :key="i"
            :matchy-event="e"
            show-info
            :to="'/events/' + e.id"
            @share="share(e)"
          />
        </template>
        <div v-else class="text-center text-grey -mb-3">
          {{ t("pages.home.no-events") }}
          <v-btn color="primary" variant="text" class="mx-auto" to="/events">{{
            t("pages.home.no-event-cta")
          }}</v-btn>
        </div>
      </section>

      <!-- Don't bother listing past user events -->

      <!-- Current organizer events -->
      <section class="mb-12" v-if="organizerEvents.current.length > 0">
        <page-title :is-subtitle="true">
          {{ t("pages.home.active-event") }}
        </page-title>
        <event-list-item
          class="mb-4"
          v-for="(e, i) in organizerEvents.current"
          :key="i"
          :matchy-event="e"
          show-image
          :to="'/events/' + e.id"
          :pulse="e.id == +currentEventStore.getCurrentId()"
          @share="share(e)"
        >
          <v-card-actions class="d-flex justify-center min-h-0">
            <v-btn
              class="-mt-4"
              v-if="e.id == +currentEventStore.getCurrentId()"
              :to="'/events/' + e.id + '/dashboard'"
              color="primary"
            >
              {{ t("pages.home.active-event-action") }}
            </v-btn>
            <v-btn
              v-else
              class="-mt-4"
              color="primary"
              @click.prevent="startEvent(e.id)"
            >
              {{ t("pages.home.active-event-start") }}
            </v-btn>
          </v-card-actions>
        </event-list-item>
      </section>

      <!-- Future organizer events -->
      <section class="mb-12">
        <page-title :is-subtitle="true">
          {{ t("pages.home.future-events-hosting-header") }}
        </page-title>
        <div class="text-h6 font-weight-bold mb-4"></div>
        <template v-if="organizerEvents.future.length > 0">
          <event-list-item
            class="mb-4"
            v-for="(e, i) in organizerEvents.future"
            :key="i"
            :matchy-event="e"
            show-info
            :to="'/events/' + e.id"
            @share="share(e)"
          />
        </template>
        <div v-else class="text-center text-grey -mb-3">
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
      </section>

      <!-- Past organizer events -->
      <section class="mb-12" v-if="organizerEvents.past.length > 0">
        <page-title :is-subtitle="true">
          {{ t("pages.home.past-events-hosting-header") }}
        </page-title>
        <div class="text-h6 font-weight-bold mb-4"></div>
        <event-list-item
          class="mb-4"
          v-for="(e, i) in organizerEvents.past"
          :key="i"
          :matchy-event="e"
          show-info
          :to="'/events/' + e.id"
        />
      </section>
    </v-container>
  </v-main>

  <!-- about us -->
  <v-footer class="flex justify-center mb-20">
    <a
      href="https://github.com/matchyOrg/.github/blob/main/profile/README.md"
      class="mx-2 text-grey"
    >
      {{ t("pages.login.footer-about-us") }}
    </a>
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSfadw82Hn0h0E6R8vLdCsXYoEZX5-ys59SOSx1UMEuhp6K-Tg/viewform?usp=sf_link"
      class="mx-2 text-grey"
    >
      {{ t("pages.login.footer-feedback") }}
    </a>
    <a
      href="https://github.com/matchyOrg/matchy/blob/main/TERMS.md"
      class="mx-2 text-grey"
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

const userEvents = ref<{
  current: EventInfo[];
  future: EventInfo[];
  past: EventInfo[];
}>({ current: [], future: [], past: [] });

const organizerEvents = ref<{
  current: EventInfo[];
  future: EventInfo[];
  past: EventInfo[];
}>({ current: [], future: [], past: [] });

function groupCurrentAndFutureEvents(events: EventInfo[]) {
  // current events have a delta of one and a half hours - or have started but not ended
  const now = Temporal.Now.instant();
  const current = events.filter((e) => {
    const diff = now.since(e.datetime);
    return (
      diff.abs().total({ unit: "hour" }) <= 1.5 || (e.is_started && !e.is_ended)
    );
  });

  const currentIds = new Set(current.map((e) => e.id));
  const future = events.filter(
    (e) => !currentIds.has(e.id) && now.since(e.datetime).sign <= 0
  );
  const past = events.filter(
    (e) => !currentIds.has(e.id) && now.since(e.datetime).sign > 0
  );

  return { current, future, past };
}

const fetchEvents = async () => {
  const participatingEvents = await eventService.fetchUserEvents();
  userEvents.value = groupCurrentAndFutureEvents(participatingEvents);
  const organizingEvents = await eventService.fetchOrganizerEvents();
  organizerEvents.value = groupCurrentAndFutureEvents(organizingEvents);
};
fetchEvents();

const share = async (e: EventInfo) => await shareEvent(e, authStore, t, router);

const confirmPresence = async (id: number) => {
  try {
    await currentEventStore.confirmPresence(id);
    successToast("Welcome to the event!");
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
