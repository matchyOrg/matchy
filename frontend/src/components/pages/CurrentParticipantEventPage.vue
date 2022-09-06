<template>
  <v-main>
    <v-container class="h-100">
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
      <div v-else>Current Round ID: {{ currentRoundId }}</div>
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
const currentRoundId = ref<number>();
const currentPairId = ref<number>();

watch(
  () => eventStarted.value,
  () => {
    roundSubscription.value = supabase
      .from("event_rounds")
      .on("INSERT", (payload) => {
        // round of some other event we do not care about
        if (payload.new.event_id !== +currentEvent.getCurrentId()) return;
        currentRoundId.value = payload.new.id;
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
    }
  }
});

onBeforeUnmount(() => {
  eventSubscription.value?.unsubscribe();
  roundSubscription.value?.unsubscribe();
  pairSubscription.value?.unsubscribe();
});
</script>
