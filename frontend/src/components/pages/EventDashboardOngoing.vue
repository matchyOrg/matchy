<template>
  <v-main>
    <v-container>
      <div class="bg-grey mb-6" :style="{ height: '100px' }"></div>
      <div class="text-h6 mb-2">Round 1</div>
      <div class="d-flex justify-center mb-4">
        <time-display :model-value="time" :max="timeSaved" />
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
        >Start round</v-btn
      >
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const time = ref(minute);

const roundOngoing = ref(false);
const countingInterval = ref<ReturnType<typeof setInterval>>();

const timeSaved = ref(minute);
const timeInput = computed<number>({
  get() {
    return timeSaved.value;
  },
  set(newVal) {
    time.value = newVal;
    timeSaved.value = newVal;
  },
});

const startRound = () => {
  roundOngoing.value = true;
  // make sure there's only ever 1 interval at a time
  clearInterval(countingInterval.value);
  countingInterval.value = setInterval(() => {
    time.value = Math.max(time.value - 1000, 0);
    if (time.value === 0) {
      roundOngoing.value = false;
      clearInterval(countingInterval.value);
    }
  }, 1000);
};
</script>
