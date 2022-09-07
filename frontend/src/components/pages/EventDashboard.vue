<template>
  <teleport to="#nav-right">
    <v-btn icon="mdi-close-octagon" variant="text" @click="endEvent"></v-btn>
  </teleport>
  <v-main>
    <v-container>
      <div class="bg-grey mb-6" :style="{ height: '100px' }"></div>
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
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import type { definitions } from "@/services/supabase-types";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentEvent = useCurrentEventStore();
const router = useRouter();

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const time = ref(minute);

const roundOngoing = ref(false);
const startingRound = ref(false);
const countingInterval = ref<ReturnType<typeof setInterval>>();

const setDuration = ref(minute);

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
  const roundStart = Temporal.Instant.from(
    round.start_timestamp
  ).toZonedDateTimeISO(Temporal.Now.timeZone());
  const roundEnd = Temporal.Instant.from(
    round.end_timestamp
  ).toZonedDateTimeISO(Temporal.Now.timeZone());
  const now = Temporal.Now.zonedDateTimeISO();
  const roundDuration = roundEnd.since(roundStart);
  const remainingTime = now.until(roundEnd);
  setDuration.value = roundDuration.total({ unit: "milliseconds" });
  time.value = remainingTime.total({ unit: "milliseconds" });
  // make sure there's only ever 1 interval at a time
  clearInterval(countingInterval.value);
  countingInterval.value = startCountdown();
};

const startRound = async () => {
  roundOngoing.value = true;
  startingRound.value = true;
  const round = await currentEvent.startNewRound(setDuration.value);
  setupTimer(round);
  startingRound.value = false;
};

const endEvent = async () => {
  try {
    await currentEvent.endCurrentEvent();
    successToast("Event ended");
    router.push("/");
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};

onMounted(async () => {
  roundOngoing.value = true;
  startingRound.value = true;
  let currentRound;
  try {
    currentRound = await currentEvent.getCurrentRound();
  } catch (e) {
    console.log(e);
    errorToast(e);
    return;
  }
  if (currentRound === null) {
    roundOngoing.value = false;
    startingRound.value = false;
    return;
  }
  setupTimer(currentRound);
  startingRound.value = false;
});
</script>
