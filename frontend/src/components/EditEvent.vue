<template>
  <v-form>
    <v-card
      class="header-container mb-8"
      width="100%"
      height="200"
      elevation="0"
      color="#E0E0E0"
    >
      <v-img :src="model.header_image" v-if="model.header_image" />
      <v-card-title class="header-text text-white">{{
        model.header_image ? "Add a header image" : "Edit header image"
      }}</v-card-title>
    </v-card>
    <v-text-field
      v-model="model.title"
      label="Title"
      name="title"
      placeholder="Event Title"
    />
    <v-textarea
      v-model="model.description"
      label="Description"
      name="Description"
      placeholder="Event description"
    />
    <v-text-field
      v-model="model.location"
      label="Location"
      name="event-location"
      placeholder="Event Location"
    />
    <v-text-field
      v-model="model.max_participants"
      type="number"
      min="2"
      label="Max participants"
      name="max-participants"
      placeholder="Maximum number of participants"
    />

    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="displayedDate"
          is-link
          readonly
          name="datePicker"
          label="Date Picker"
          placeholder="Select date"
          @click="showDatePicker = true"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="displayedTime"
          is-link
          readonly
          name="datePicker"
          label="Date Picker"
          placeholder="Select date"
          @click="showTimePicker = true"
        />
      </v-col>
    </v-row>

    <v-switch v-model="model.uses_groups" size="20" />

    <v-row v-if="model.uses_groups">
      <v-col cols="6">
        <v-text-field
          v-model="model.event_groups!.groupA.title"
          name="group-a-title"
          placeholder="Group A Name"
        />
        <v-textarea
          v-model="model.event_groups!.groupA.description"
          name="group-a-description"
          placeholder="Group A description"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="model.event_groups.groupB.title"
          name="group-b-title"
          placeholder="Group B Name"
        />
        <v-textarea
          v-model="model.event_groups.groupB.description"
          name="group-b-description"
          placeholder="Group B description"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup lang="ts">
import type { EditEventInfo } from "@/services/eventService";
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

<style>
.header-container {
  position: relative;
}

.header-text {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
}
</style>
