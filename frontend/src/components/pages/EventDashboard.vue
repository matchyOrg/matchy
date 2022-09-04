<template>
  <v-main>
    <v-container>
      <div class="bg-grey mb-6" :style="{ height: '100px' }"></div>
      <div class="text-h6 mb-2">{{ t("pages.dashboard.ongoing.round") }} 1</div>
      <div class="d-flex justify-center mb-4">
        <time-display
          :loading="startingRound"
          :model-value="time"
          :max="actualDuration"
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
import { useCurrentEventStore } from "@/stores/currentEvent";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentEvent = useCurrentEventStore();

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const time = ref(minute);

const roundOngoing = ref(false);
const startingRound = ref(false);
const countingInterval = ref<ReturnType<typeof setInterval>>();

const setDuration = ref(minute);
const actualDuration = ref(minute);

const timeInput = computed<number>({
  get() {
    return setDuration.value;
  },
  set(newVal) {
    setDuration.value = newVal;
    time.value = newVal;
  },
});

const startRound = async () => {
  roundOngoing.value = true;
  // make sure there's only ever 1 interval at a time
  clearInterval(countingInterval.value);
  startingRound.value = true;
  const round = await currentEvent.startNewRound(setDuration.value);
  const start = Temporal.Now.zonedDateTimeISO();
  const end = Temporal.Instant.from(round.end_timestamp).toZonedDateTimeISO(
    Temporal.Now.timeZone()
  );
  const diff = end.since(start);
  actualDuration.value = diff.total({ unit: "milliseconds" });
  time.value = actualDuration.value;
  countingInterval.value = setInterval(() => {
    time.value = Math.max(time.value - 1000, 0);
    if (time.value === 0) {
      roundOngoing.value = false;
      clearInterval(countingInterval.value);
      time.value = setDuration.value;
    }
  }, 1000);
  startingRound.value = false;
};
</script>
