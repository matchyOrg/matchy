<template>
  <v-form>
    <div class="text-right">
      <span class="text-red" @click="removeImage">Remove Image</span>
    </div>
    <v-card
      class="header-container mb-8"
      width="100%"
      height="200"
      elevation="0"
      color="#E0E0E0"
    >
      <v-img :src="headerImageSrc" v-if="hasHeaderImage" />
      <v-card-title class="header-text absolute text-white">{{
        model.header_image ? "Add a header image" : "Edit header image"
      }}</v-card-title>
      <v-file-input
        hide-details
        class="file-input absolute opacity-0 h-48"
        accept="image/*"
        v-model="headerImage"
      />
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

    <v-switch v-model="model.uses_groups" size="20" color="primary" />

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

// const showPicker = ref(false);

const showDatePicker = ref(false);
const showTimePicker = ref(false);

// const currentDate = ref(["2021", "01", "01"]);
// const currentTime = ref(["12", "00"]);

// the new image, file input only accept file-arrays
const headerImage = ref<File[]>([]);

// there exists a header image if either one was provided in the beginning
// or one was uploaded
const hasHeaderImage = computed(
  () => !!headerImage.value[0] || !!model.value.header_image
);

const headerImageSrc = computed(() => {
  if (headerImage.value[0]) {
    // convert image file to image src
    return URL.createObjectURL(headerImage.value[0]);
  } else {
    import.meta.env.VITE_SUPABASE_STORAGE_URL +
      "event-image-headers/" +
      model.value.header_image;
  }
});

watch(
  () => headerImage.value,
  () => (model.value.header_image_file = headerImage.value[0])
);

const removeImage = () => {
  model.value.header_image = undefined;
  headerImage.value = [];
  if (headerImageSrc.value) {
    // if the url does not exist nothing happens
    URL.revokeObjectURL(headerImageSrc.value);
  }
};

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

// const dateTime = ref("");
</script>

<style>
.header-container {
  position: relative;
}

.absolute {
  position: absolute;
  top: 0;
  width: 100%;
}

.header-text {
  background: rgba(0, 0, 0, 0.2);
}

.file-input:active + .header-text {
  background: rgba(0, 0, 0, 0.1);
}

.opacity-0 {
  opacity: 0;
}

.h-48 {
  height: 48px;
}
</style>
