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
import { useCurrentEventStore } from "@/stores/currentEvent";
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
    }
  }
});

onBeforeUnmount(() => {
  eventSubscription.value?.unsubscribe();
  roundSubscription.value?.unsubscribe();
  pairSubscription.value?.unsubscribe();
});
</script>
