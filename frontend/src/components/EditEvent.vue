<template>
  <v-form>
    <div class="text-right" v-if="!excludeFields.includes('header_image')">
      <span class="text-red" @click="removeImage">{{
        t("components.edit-event.remove-image")
      }}</span>
    </div>
    <v-card
      v-if="!excludeFields.includes('header_image')"
      class="header-container mb-8"
      width="100%"
      height="200"
      elevation="0"
      color="#E0E0E0"
    >
      <v-img cover :src="headerImageSrc" v-if="hasHeaderImage" />
      <v-card-title class="header-text absolute text-white">{{
        model.header_image
          ? t("components.edit-event.add-image")
          : t("components.edit-event.edit-image")
      }}</v-card-title>
      <v-file-input
        hide-details
        class="file-input absolute opacity-0 h-48"
        accept="image/*"
        v-model="headerImage"
        :key="updateId"
      />
    </v-card>
    <v-text-field
      v-model="model.title"
      v-if="!excludeFields.includes('title')"
      :label="t('components.edit-event.title-input')"
      name="title"
      :placeholder="t('components.edit-event.title-placeholder')"
    />
    <v-textarea
      v-model="model.description"
      v-if="!excludeFields.includes('description')"
      :label="t('components.edit-event.description-input')"
      name="description"
      :placeholder="t('components.edit-event.description-placeholder')"
    />
    <v-text-field
      v-model="model.location"
      v-if="!excludeFields.includes('location')"
      :label="t('components.edit-event.location-input')"
      name="event-location"
      :placeholder="t('components.edit-event.location-placeholder')"
    />
    <v-text-field
      v-model="model.max_participants"
      v-if="!excludeFields.includes('max_participants')"
      type="number"
      min="2"
      :label="t('components.edit-event.max-participants')"
      name="max-participants"
      :placeholder="t('components.edit-event.max-participants-placeholder')"
    />
    <v-row v-if="!excludeFields.includes('datetime')">
      <v-col cols="6">
        <v-text-field
          :model-value="displayedDate"
          is-link
          readonly
          name="datePicker"
          :label="t('components.edit-event.date-label')"
          :placeholder="t('components.edit-event.date-placeholder')"
          @click="showDatePicker = true"
        />
        <v-dialog v-model="showDatePicker">
          <v-card class="pa-8"
            ><input type="date" v-model="currentDate"
          /></v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :model-value="displayedTime"
          is-link
          readonly
          name="datePicker"
          :label="t('components.edit-event.time-label')"
          :placeholder="t('components.edit-event.time-placeholder')"
          @click="showTimePicker = true"
        />
        <v-dialog v-model="showTimePicker">
          <v-card class="pa-8"
            ><input type="time" v-model="currentTime"
          /></v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-switch
      v-model="model.uses_groups"
      v-if="!excludeFields.includes('event_groups')"
      size="20"
      color="primary"
    />

    <v-row v-if="model.uses_groups && !excludeFields.includes('event_groups')">
      <v-col cols="6">
        <v-text-field
          v-model="model.event_groups!.groupA.title"
          :label="t('components.edit-event.group-a-name')"
          name="group-a-title"
          :placeholder="t('components.edit-event.group-a-name')"
        />
        <v-textarea
          v-model="model.event_groups!.groupA.description"
          name="group-a-description"
          :label="t('components.edit-event.group-a-description-label')"
          :placeholder="
            t('components.edit-event.group-a-description-placeholder')
          "
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="model.event_groups.groupB.title"
          name="group-b-title"
          :label="t('components.edit-event.group-b-name')"
          :placeholder="t('components.edit-event.group-b-name')"
        />
        <v-textarea
          v-model="model.event_groups.groupB.description"
          name="group-b-description"
          :label="t('components.edit-event.group-b-description-label')"
          :placeholder="
            t('components.edit-event.group-b-description-placeholder')
          "
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup lang="ts">
import type { EditEventInfo } from "@/services/eventService";
import { instantToZonedDateTime } from "@/services/utils/datetime";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type InputField = keyof Omit<EditEventInfo, "headerImageFile" | "uses_groups">;

const props = withDefaults(
  defineProps<{
    modelValue: EditEventInfo;
    excludeFields?: InputField[];
  }>(),
  { excludeFields: () => [] }
);

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

const updateId = ref(0);

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
    URL.revokeObjectURL(headerImageSrc.value);
    return URL.createObjectURL(headerImage.value[0]);
  } else {
    return import.meta.env.VITE_SUPABASE_STORAGE_URL + model.value.header_image;
  }
});

watch(
  () => headerImage.value,
  () => (model.value.headerImageFile = headerImage.value[0])
);

watch(
  () => headerImage.value,
  () => updateId.value++
);

const removeImage = () => {
  model.value.header_image = undefined;
  headerImage.value = [];
  if (headerImageSrc.value) {
    // if the url does not exist nothing happens
    URL.revokeObjectURL(headerImageSrc.value);
  }
};

const currentDate = computed<string>({
  get() {
    const currentDate = instantToZonedDateTime(model.value.datetime);
    return (
      currentDate.year.toString() +
      "-" +
      zeroPad(currentDate.month) +
      "-" +
      zeroPad(currentDate.day)
    );
  },
  set(newVal) {
    const oldDate = instantToZonedDateTime(model.value.datetime);
    const [year, month, day] = newVal.split("-");
    model.value.datetime = Temporal.ZonedDateTime.from({
      timeZone: oldDate.timeZone,
      hour: oldDate.hour,
      minute: oldDate.minute,
      year: +year,
      month: +month,
      day: +day,
    }).toInstant();
  },
});

const currentTime = computed<string>({
  get() {
    const currentDate = instantToZonedDateTime(model.value.datetime);
    return zeroPad(currentDate.hour) + ":" + zeroPad(currentDate.minute);
  },
  set(newVal) {
    const oldDate = instantToZonedDateTime(model.value.datetime);
    const [hour, minute] = newVal.split(":");
    model.value.datetime = Temporal.ZonedDateTime.from({
      timeZone: oldDate.timeZone,
      hour: +hour,
      minute: +minute,
      year: oldDate.year,
      month: oldDate.month,
      day: oldDate.day,
    }).toInstant();
  },
});

const zeroPad = (s: any) => String(s).padStart(2, "0");

const displayedDate = computed(() => {
  const [year, month, day] = currentDate.value.split("-");
  return `${zeroPad(year)}-${zeroPad(month)}-${zeroPad(day)}`;
});

const displayedTime = computed(() => {
  const [hour, minute] = currentTime.value.split(":");
  return `${zeroPad(hour)}:${zeroPad(minute)}`;
});

// make sure we release the url
onBeforeUnmount(() => URL.revokeObjectURL(headerImageSrc.value));

// const dateTime = ref("");
</script>

<style scoped>
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
