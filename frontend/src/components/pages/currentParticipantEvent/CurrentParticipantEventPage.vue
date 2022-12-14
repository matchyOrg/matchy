<template>
  <v-main>
    <v-container class="h-100 pt-12">
      <event-ended-view v-if="eventEnded" />
      <waiting-for-event-start-view v-else-if="!eventStarted" />
      <create-pairing-view
        :user-id="authStore.user?.id ?? 'unavailable'"
        :round-time="roundRemainingTime"
        @partner-found="createPair"
        v-else-if="roundOngoing && !currentPairId"
      />
      <ongoing-round-view
        :round-time="roundRemainingTime"
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
import type { definitions } from "@/services/generated/supabase-types";
import { timestampToInstant } from "@/services/utils/datetime";
import { useAuthStore } from "@/stores/auth";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import type { RealtimeSubscription } from "@supabase/realtime-js";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const currentEvent = useCurrentEventStore();

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

const roundTimes = ref<{ start: Temporal.Instant; end: Temporal.Instant }>();
const roundRemainingTime = ref<number>();
const roundDuration = computed(() => {
  const time = roundTimes.value;
  return time
    ? time.end.since(time.start).total({ unit: "milliseconds" })
    : undefined;
});
const countingInterval = ref<number>();

const confirmPresence = async (id: number) => {
  try {
    await currentEvent.confirmPresence(id);
    successToast("Welcome to the event!");
  } catch (e) {
    errorToast(e);
  }
};

const startCountdown = () =>
  window.setInterval(() => {
    if (roundTimes.value === undefined) {
      clearInterval(countingInterval.value);
      return;
    }
    const remainingTime = Temporal.Now.instant()
      .until(roundTimes.value.end)
      .total({ unit: "milliseconds" });
    roundRemainingTime.value = Math.max(remainingTime, 0);

    if (remainingTime <= 0) {
      roundOngoing.value = false;
      clearInterval(countingInterval.value);
    }
  }, 1000);

const setupTimer = (round: definitions["event_rounds"]) => {
  const roundStart = timestampToInstant(round.start_timestamp);
  const roundEnd = timestampToInstant(round.end_timestamp);
  roundTimes.value = {
    start: roundStart,
    end: roundEnd,
  };

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
      // this could be refactored into a computed()
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
  const eventRouteId = route.params.id;
  if (eventRouteId === null) {
    errorToast("This event does not exist");
    router.push("/");
    return;
  }

  await confirmPresence(+eventRouteId);

  if (!currentEvent.hasEvent) {
    errorToast("Missing current event");
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
