<template>
  <van-form>
    <van-cell-group title="Event details">
      <van-field v-model="model.title" name="title" placeholder="Event Title" />
      <van-field
        v-model="model.description"
        type="textarea"
        name="Description"
        placeholder="Event description"
      />
      <van-field
        v-model="model.location"
        name="event-location"
        placeholder="Event Location"
      />
      <van-field
        v-model="model.max_participants"
        type="number"
        min="2"
        name="max-participants"
        placeholder="Maximum number of participants"
      />

      <van-field name="uses-groups" label="Uses Groups?">
        <template #input>
          <van-switch v-model="model.uses_groups" size="20" />
        </template>
      </van-field>

      <!-- <van-field
        v-model="displayedDate"
        is-link
        readonly
        name="datePicker"
        label="Date Picker"
        placeholder="Select date"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-date-picker @cancel="showPicker = false" />
      </van-popup> -->

      <van-field
        v-model="displayedDate"
        is-link
        readonly
        name="datePicker"
        label="Date Picker"
        placeholder="Select date"
        @click="showDatePicker = true"
      />

      <van-popup v-model:show="showDatePicker" round :style="{ height: '30%' }">
        <van-date-picker v-model="currentDate" title="Choose Date" />
      </van-popup>

      <van-field
        v-model="displayedTime"
        is-link
        readonly
        name="datePicker"
        label="Date Picker"
        placeholder="Select date"
        @click="showTimePicker = true"
      />
      <van-popup v-model:show="showTimePicker" round :style="{ height: '30%' }">
        <van-time-picker v-model="currentTime" title="Choose Time" />
      </van-popup>
    </van-cell-group>

    <van-cell-group title="Group A" v-if="model.uses_groups">
      <van-field
        v-model="model.event_groups.groupA.title"
        name="group-a-title"
        placeholder="Group A Name"
      />
      <van-field
        v-model="model.event_groups.groupA.description"
        type="textarea"
        name="group-a-description"
        placeholder="Group A description"
      />
    </van-cell-group>

    <van-cell-group title="Group B" v-if="model.uses_groups">
      <van-field
        v-model="model.event_groups.groupB.title"
        name="group-b-title"
        placeholder="Group B Name"
      />
      <van-field
        v-model="model.event_groups.groupB.description"
        type="textarea"
        name="group-b-description"
        placeholder="Group B description"
      />
    </van-cell-group>
  </van-form>
  <div></div>
</template>
<script setup lang="ts">
import type { EditEventInfo } from "@/services/events";
import { Temporal } from "@js-temporal/polyfill";
const props = defineProps<{
  modelValue: EditEventInfo;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: EditEventInfo): void;
}>();

const model = computed<EditEventInfo>({
  get(): EditEventInfo {
    return props.modelValue;
  },
  set(newVal: EditEventInfo) {
    emits("update:modelValue", newVal);
  },
});

const showPicker = ref(false);

const showDatePicker = ref(false);
const showTimePicker = ref(false);

// const currentDate = ref(["2021", "01", "01"]);
// const currentTime = ref(["12", "00"]);

console.log(model.value.datetime);

const currentDate = computed<string[]>({
  get() {
    const currentDate = model.value.datetime;
    return [
      currentDate.year.toString(),
      currentDate.month.toString(),
      currentDate.day.toString(),
    ];
  },
  set(newVal) {
    const oldDate = model.value.datetime;
    model.value.datetime = Temporal.ZonedDateTime.from({
      ...oldDate,
      year: Number.parseInt(newVal[0]),
      month: Number.parseInt(newVal[1]),
      day: Number.parseInt(newVal[2]),
    });
  },
});

const currentTime = computed<string[]>({
  get() {
    const currentDate = model.value.datetime;
    return [currentDate.hour.toString(), currentDate.minute.toString()];
  },
  set(newVal) {
    const oldDate = model.value.datetime;
    model.value.datetime = Temporal.ZonedDateTime.from({
      ...oldDate,
      hour: Number.parseInt(newVal[0]),
      minute: Number.parseInt(newVal[1]),
    });
  },
});

const displayedDate = computed(() => {
  const vals = currentDate.value;
  return `${vals[0]}-${vals[1]}-${vals[2]}`;
});

const displayedTime = computed(() => {
  const vals = currentTime.value;
  return `${vals[0]}:${vals[1]}`;
});

const dateTime = ref("");
</script>
