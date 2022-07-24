<template>
  <div>
    Component for editing events.

    <van-popup v-model:show="showDatePicker" round :style="{ height: '30%' }">
      <van-date-picker v-model="currentDate" title="Choose Date" />
    </van-popup>
    <van-popup v-model:show="showTimePicker" round :style="{ height: '30%' }">
      <van-time-picker v-model="currentTime" title="Choose Time" />
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import type { EditEventInfo } from "@/services/events";
const props = defineProps<{
  modelValue: EditEventInfo;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: EditEventInfo): void;
}>();

const showDatePicker = ref(false);
const showTimePicker = ref(false);
const currentDate = ref(["2021", "01", "01"]);
const currentTime = ref(["12", "00"]);
</script>
