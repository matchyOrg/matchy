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
      <div v-else>Event started</div>
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

const eventStarted = ref(false);

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
  }
});

onBeforeUnmount(() => {
  eventSubscription.value?.unsubscribe();
});
</script>
