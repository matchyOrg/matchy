<template>
  <v-main>
    <v-container
      class="d-flex flex-column align-center justify-center"
      v-if="loadingEvent"
    >
      <v-progress-circular indeterminate />
    </v-container>
    <v-container
      class="d-flex flex-column align-center justify-center"
      v-else-if="eventEnded"
    >
      <span class="d-block text-h6 mb-2">{{
        t("pages.dashboard.event-ended")
      }}</span>
      <span>{{ t("pages.dashboard.event-result-publish-reminder") }} </span>
      <v-btn
        class="d-block mx-auto"
        color="primary"
        variant="text"
        :to="'/events/' + eventId"
      >
        {{ t("pages.dashboard.back-to-overview") }}
      </v-btn>
    </v-container>
    <v-container v-else-if="eventStarted">
      <round-overview
        v-if="!hasNoRoundYet"
        :votes="votesThisRound"
        :total-expected-votes="pairsThisRound * 2"
        :users-in-pairs="pairsThisRound * 2"
        :total-expected-users="totalPresent"
      />
      <div class="text-h6 mb-2">{{ t("pages.dashboard.ongoing.round") }} 1</div>
      <div class="d-flex justify-center mb-4">
        <time-display
          :loading="startingRound"
          :model-value="time"
          :max="setDuration"
        />
      </div>
      <v-slider
        v-model="timeInput"
        type="number"
        :min="minute"
        :max="hour / 3"
        :step="minute / 2"
        :disabled="roundOngoing"
      />
      <v-btn
        class="d-block mx-auto"
        @click="startRound"
        :disabled="roundOngoing"
        >{{ t("pages.dashboard.ongoing.start-round") }}</v-btn
      >

      <v-btn
        class="d-block mx-auto mt-20"
        variant="tonal"
        color="error"
        @click="endEvent"
      >
        <v-icon left>mdi-close</v-icon>
        {{ t("pages.dashboard.ongoing.end-event") }}
      </v-btn>
    </v-container>
    <v-container class="d-flex flex-column align-center justify-center" v-else>
      <div class="text-h6 mb-2">
        {{ t("pages.dashboard.event-not-started") }}
      </div>
      <v-btn class="d-block mx-auto" color="primary" @click="startEvent">
        {{ t("pages.dashboard.start-event") }}
      </v-btn>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useEventService } from "@/services/eventService";
import { supabase } from "@/services/supabase";
import type { definitions } from "@/services/generated/supabase-types";
import { timestampToInstant } from "@/services/utils/datetime";
import { useAuthStore } from "@/stores/auth";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import type { RealtimeSubscription } from "@supabase/realtime-js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentEvent = useCurrentEventStore();
const authStore = useAuthStore();
const eventService = useEventService(authStore);
const router = useRouter();
const route = useRoute();

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const time = ref(minute);

const loadingEvent = ref(true);

const eventId = ref<number>();
const currentRoundId = ref<number>();
const roundOngoing = ref(false);
const startingRound = ref(false);
const hasNoRoundYet = ref(false);
const countingInterval = ref<ReturnType<typeof setInterval>>();

const pairsThisRound = ref(0);
const votesThisRound = ref(0);
const totalPresent = ref();

const pairSubscription = ref<RealtimeSubscription>();
const voteSubscription = ref<RealtimeSubscription>();

const setDuration = ref(minute);

const eventEnded = ref(false);
const eventStarted = ref(false);

const startEvent = async () => {
  try {
    await currentEvent.startEvent(+currentEvent.getCurrentId());
    eventStarted.value = true;
  } catch (e) {
    errorToast(e);
  }
};

const timeInput = computed<number>({
  get() {
    return setDuration.value;
  },
  set(newVal) {
    setDuration.value = newVal;
    time.value = newVal;
  },
});

const startCountdown = () =>
  setInterval(() => {
    time.value = Math.max(time.value - 1000, 0);
    if (time.value === 0) {
      roundOngoing.value = false;
      clearInterval(countingInterval.value);
      time.value = setDuration.value;
    }
  }, 1000);

const setupTimer = (round: definitions["event_rounds"]) => {
  const roundStart = timestampToInstant(round.start_timestamp);
  const roundEnd = timestampToInstant(round.end_timestamp);
  const now = Temporal.Now.instant();
  const roundDuration = roundEnd.since(roundStart);
  const remainingTime = now.until(roundEnd);
  setDuration.value = roundDuration.total({ unit: "milliseconds" });
  const remainingMilliseconds = remainingTime.total({ unit: "milliseconds" });
  if (remainingMilliseconds <= 0) {
    roundOngoing.value = false;
    time.value = setDuration.value;
  } else {
    time.value = remainingTime.total({ unit: "milliseconds" });
    // make sure there's only ever 1 interval at a time
    clearInterval(countingInterval.value);
    countingInterval.value = startCountdown();
  }
};

const startRound = async () => {
  roundOngoing.value = true;
  startingRound.value = true;
  const round = await currentEvent.startNewRound(setDuration.value);
  currentRoundId.value = round.id;
  setupTimer(round);
  startingRound.value = false;
  hasNoRoundYet.value = false;
};

const endEvent = async () => {
  try {
    await currentEvent.endCurrentEvent();
    successToast("Event ended");
    router.push("/");
  } catch (e) {
    errorToast(e);
  }
};

watch(
  () => currentRoundId.value,
  () => {
    pairsThisRound.value = 0;
    votesThisRound.value = 0;
    pairSubscription.value = supabase
      .from<any>("event_user_pairs:event_round=eq." + currentRoundId.value)
      .on("INSERT", () => {
        pairsThisRound.value += 1;
      })
      .subscribe(async (e: string) => {
        console.log("pair", e);
        if (currentRoundId.value == undefined) return;
        pairsThisRound.value += await currentEvent.getNumberOfPairsThisRound(
          currentRoundId.value
        );
      });
    voteSubscription.value = supabase
      .from<any>("votes")
      .on("INSERT", () => {
        votesThisRound.value += 1;
      })
      .subscribe(async (e: string) => {
        console.log("vote", e);
        if (currentRoundId.value == undefined) return;
        votesThisRound.value += await currentEvent.getNumberOfVotesThisRound(
          currentRoundId.value
        );
      });
  }
);

onMounted(async () => {
  loadingEvent.value = true;
  const idString = route.params.id;
  if (Number.isNaN(+idString)) {
    errorToast("Not a valid event id");
    router.back();
    return;
  }
  eventId.value = +idString;
  try {
    const event = await eventService.fetchEventById(eventId.value);
    if (event === null) {
      errorToast("We couldn't load this event");
      router.back();
      return;
    }
    if (event.organizer !== authStore.user?.id) {
      errorToast("Only the organizer can manage the event");
      router.back();
      return;
    }
    eventStarted.value = event.is_started;
    eventEnded.value = event.is_ended;
    if (event.is_ended) return;

    roundOngoing.value = true;
    startingRound.value = true;
    let currentRound;
    try {
      currentRound = await currentEvent.getCurrentOngoingRound();
    } catch (e) {
      errorToast(e);
      return;
    }
    if (currentRound === null) {
      roundOngoing.value = false;
      startingRound.value = false;
      hasNoRoundYet.value = true;
      return;
    }
    currentRoundId.value = currentRound.id;
    startingRound.value = false;
    setupTimer(currentRound);
    try {
      totalPresent.value = await currentEvent.getTotalNumberOfParticipants();
    } catch (e) {
      errorToast(e);
    }
  } catch (e) {
    errorToast(e, "Could not load event");
    router.back();
    return;
  } finally {
    loadingEvent.value = false;
  }
});

onBeforeUnmount(() => {
  pairSubscription.value?.unsubscribe();
  voteSubscription.value?.unsubscribe();
});
</script>
