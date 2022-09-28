<template>
  <v-main>
    <v-container class="h-100 pt-12">
      <event-ended-view v-if="eventEnded" />
      <waiting-for-event-start-view v-else-if="!eventStarted" />
      <create-pairing-view
        :user-id="authStore.user?.id ?? 'unavailable'"
        :round-time="roundTime"
        @partner-found="createPair"
        v-else-if="roundOngoing && !currentPairId"
      />
      <ongoing-round-view
        :round-time="roundTime"
        :round-duration="roundDuration"
        v-else-if="roundOngoing"
      />
      <vote-view @vote="vote" v-else-if="!hasVoted && currentPairId" />
      <waiting-for-round-view v-else />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { supabase } from "@/services/supabase";
import type { definitions } from "@/services/supabase-types";
import { useAuthStore } from "@/stores/auth";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import type { RealtimeSubscription } from "@supabase/realtime-js";
import { useI18n } from "vue-i18n";

const router = useRouter();
const authStore = useAuthStore();
const currentEvent = useCurrentEventStore();
const { t } = useI18n();

const eventSubscription = ref<RealtimeSubscription>();
const roundSubscription = ref<RealtimeSubscription>();
const pairSubscription = ref<RealtimeSubscription>();

const eventStarted = ref(false);
const eventEnded = ref(false);
const roundOngoing = ref(false);
const hasVoted = ref(false);
const currentRound = ref<definitions["event_rounds"]>();
const currentRoundId = ref<number>();
const currentPairId = ref<number>();

const roundTime = ref<number>();
const roundDuration = ref<number>();
const countingInterval = ref<number>();

const startCountdown = () =>
  window.setInterval(() => {
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
  console.log("duration", roundDuration.value);
  console.log("time", roundTime.value);

  // make sure there's only ever 1 interval at a time
  clearInterval(countingInterval.value);
  countingInterval.value = startCountdown();
};

const vote = async (match: boolean) => {
  if (!currentPairId.value) return;
  try {
    await currentEvent.vote(currentPairId.value, match);
    hasVoted.value = true;
    // clear round specific variables
    currentPairId.value = undefined;
    currentRoundId.value = undefined;
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};

const createPair = async (otherUserId: string) => {
  if (!currentRoundId.value) return;
  try {
    await currentEvent.createPair(otherUserId, currentRoundId.value);
    successToast;
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};

const setupRoundSubscription = () => {
  roundSubscription.value = supabase
    .from("event_rounds")
    .on("INSERT", (payload) => {
      // round of some other event we do not care about
      if (payload.new.event_id !== +currentEvent.getCurrentId()) return;
      currentRound.value = payload.new;
      setupTimer(payload.new);
      currentRoundId.value = payload.new.id;
      roundOngoing.value = true;
      // clear pairId of last round
      currentPairId.value = undefined;
      hasVoted.value = false;
    })
    .subscribe();

  /*
    wait for the subscription to be completely established
    then try to fetch the round info.
    this way there shouldn't be a time inbetween,
    where a round might be pushed after we tried fetching it
    but before we established the subscription 

    Yes, this is cursed

    TODO: update this if realtime-js gets a proper join listener
    */
  function checkConnectionEstablished(resolve: (value: unknown) => void) {
    if (
      roundSubscription.value?.isJoined() ||
      roundSubscription.value?.isErrored()
    ) {
      resolve(null);
    } else {
      setTimeout(() => checkConnectionEstablished(resolve), 50);
    }
  }
  const connectionEstablished = new Promise(checkConnectionEstablished);

  connectionEstablished.then(async () => {
    console.log("Round suscription established");
    const round = await currentEvent.getCurrentRoundInfo();
    if (round !== null) {
      currentRound.value = round;
      currentRoundId.value = round.id;
      // end_timestamp is in future
      const hasNotEnded =
        Temporal.Instant.from(round.end_timestamp).since(Temporal.Now.instant())
          .sign > 0;
      roundOngoing.value = hasNotEnded;
      currentPairId.value = round.pairId ?? undefined;
      hasVoted.value = round.hasVoted;
      if (hasNotEnded) {
        currentRoundId.value = round.id;
      }
      setupTimer(round);
    }
  });
};

const setupPairSubscription = () => {
  pairSubscription.value = supabase
    .from("event_user_pairs")
    .on("INSERT", (payload) => {
      currentPairId.value = payload.new.id;
    })
    .subscribe();
  console.log("pair subscription activiated");
};

const recoverStateOnVisibilityChange = () => {
  if (document.visibilityState !== "visible") {
    return;
  }
  if (
    roundSubscription.value?.isErrored() ||
    roundSubscription.value?.isClosed()
  ) {
    setupRoundSubscription();
  }
  if (
    pairSubscription.value?.isErrored() ||
    pairSubscription.value?.isClosed()
  ) {
    setupPairSubscription();
  }
  if (currentRound.value) setupTimer(currentRound.value);
};

const reestablishCallback = () => recoverStateOnVisibilityChange();

watch(
  () => eventStarted.value,
  () => {
    setupRoundSubscription();
    setupPairSubscription();
  }
);

watch(
  () => eventStarted.value,
  () => {
    document.addEventListener("visibilitychange", reestablishCallback);
  }
);

onMounted(async () => {
  if (
    !currentEvent.hasEvent ||
    +useRoute().params.id !== +currentEvent.getCurrentId()
  ) {
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
  try {
    const event = await currentEvent.getCurrentEvent();
    if (event === null) {
      errorToast(
        "This event does not exist or you have not confirmed you're present"
      );
      router.push("/");
      return;
    }
    if (event.is_ended) {
      eventEnded.value = true;
      return;
    }

    eventStarted.value = event.is_started;
    console.log(eventStarted.value);
  } catch (e) {
    console.log(e);
  }
});

onBeforeUnmount(() => {
  eventSubscription.value?.unsubscribe();
  roundSubscription.value?.unsubscribe();
  pairSubscription.value?.unsubscribe();
  document.removeEventListener("visibilitychange", reestablishCallback);
});
</script>
