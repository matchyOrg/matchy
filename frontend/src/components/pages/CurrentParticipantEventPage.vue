<template>
  <v-main>
    <v-container class="h-100 pt-12">
      <div
        v-if="!eventStarted"
        class="h-50 d-flex flex-column align center justify-center pl-2"
      >
        <span class="d-flex font-weight-medium text-h6"
          >The event hasn't started yet...</span
        >
        <span class="d-block text-subtitle-2"
          >Please wait for the organizer to start the event</span
        >
      </div>
      <div
        class="h-100 d-flex justify-center align-center"
        v-else-if="eventEnded"
      >
        <span class="d-block">That's all volks!</span>
      </div>
      <div v-else-if="roundOngoing && !currentPairId">
        <span class="d-block text-body-1 font-weight-bold"
          >Let's find you a partner for this round!
        </span>
        <span class="d-block mb-4 text-body-2"
          >Use the Qr-Scanner below or type their id in the textbox</span
        >
        <span class="d-block mb-4 text-body-2"
          >{{ displayTime }} minutes left</span
        >
        <div
          :style="{ width: '250px', height: '250px' }"
          class="bg-grey mx-auto"
        >
          <span class="text-white">Nice Qr-Code scanner</span>
        </div>
        <v-text-field v-model="otherUser" label="ID (optional)">
          <template v-slot:append>
            <v-btn @click="createPair" color="secondary">Pair</v-btn>
          </template>
        </v-text-field>
      </div>
      <div v-else>Waiting for new round...</div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import router from "@/router";
import { supabase } from "@/services/supabase";
import type { definitions } from "@/services/supabase-types";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import type { RealtimeSubscription } from "@supabase/realtime-js";

const currentEvent = useCurrentEventStore();

const eventSubscription = ref<RealtimeSubscription>();
const roundSubscription = ref<RealtimeSubscription>();
const pairSubscription = ref<RealtimeSubscription>();

const eventStarted = ref(false);
const eventEnded = ref(false);
const roundOngoing = ref(false);
const currentRoundId = ref<number>();
const currentPairId = ref<number>();

const otherUser = ref("");

const roundTime = ref<number>();
const roundDuration = ref<number>();
const countingInterval = ref<number>();

const displayTime = computed(() => {
  if (!roundTime.value) return "00:00";
  const minutes = Math.floor(roundTime.value / (60 * 1000));
  const seconds = Math.floor((roundTime.value % (60 * 1000)) / 1000);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
});

const startCountdown = () =>
  setInterval(() => {
    if (!roundTime.value) {
      clearInterval(countingInterval.value);
      return;
    }
    roundTime.value = Math.max(roundTime.value - 1000, 0);
    if (roundTime.value === 0) {
      roundOngoing.value = false;
      clearInterval(countingInterval.value);
    }
  }, 1000);

const setupTimer = (round: definitions["event_rounds"]) => {
  const roundStart = Temporal.Instant.from(
    round.start_timestamp
  ).toZonedDateTimeISO(Temporal.Now.timeZone());
  const roundEnd = Temporal.Instant.from(
    round.end_timestamp
  ).toZonedDateTimeISO(Temporal.Now.timeZone());
  const now = Temporal.Now.zonedDateTimeISO();
  const duration = roundEnd.since(roundStart);
  const remainingTime = now.until(roundEnd);
  roundDuration.value = duration.total({ unit: "milliseconds" });
  roundTime.value = remainingTime.total({ unit: "milliseconds" });
  // make sure there's only ever 1 interval at a time
  clearInterval(countingInterval.value);
  countingInterval.value = startCountdown();
};

const createPair = async () => {
  if (!currentRoundId.value) return;
  try {
    await currentEvent.createPair(otherUser.value, currentRoundId.value);
    successToast;
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};

watch(
  () => eventStarted.value,
  () => {
    roundSubscription.value = supabase
      .from("event_rounds")
      .on("INSERT", (payload) => {
        // round of some other event we do not care about
        if (payload.new.event_id !== +currentEvent.getCurrentId()) return;
        currentRoundId.value = payload.new.id;
        roundOngoing.value = true;
        setupTimer(payload.new);
      })
      .subscribe();
    console.log("round subscription activated");
    pairSubscription.value = supabase
      .from("event_user_pairs")
      .on("INSERT", (payload) => {
        currentPairId.value = payload.new.id;
      })
      .subscribe();
    console.log("pair subscription activiated");
  }
);

onMounted(async () => {
  if (!currentEvent.hasEvent) {
    errorToast(
      "This event does not exist or you have not confirmed you're present"
    );
    router.push("/");
    return;
  }
  const eventId = +currentEvent.getCurrentId();
  // Generated types do not work with the realtime syntax
  eventSubscription.value = supabase
    .from<any>("events:id=eq." + eventId)
    .on("UPDATE", (payload) => {
      if (payload.new.is_started) eventStarted.value = true;
      if (payload.new.is_ended) eventEnded.value = true;
    })
    .subscribe();
  const event = await currentEvent.getCurrentEvent();
  if (event === null) {
    errorToast(
      "This event does not exist or you have not confirmed you're present"
    );
    router.push("/");
    return;
  }
  if (event.is_started) {
    eventStarted.value = true;
    const ongoingRound = await currentEvent.getCurrentRound();
    if (ongoingRound !== null) {
      currentRoundId.value = ongoingRound.id;
      roundOngoing.value = true;
      setupTimer(ongoingRound);
    }
  }
});

onBeforeUnmount(() => {
  eventSubscription.value?.unsubscribe();
  roundSubscription.value?.unsubscribe();
  pairSubscription.value?.unsubscribe();
});
</script>
