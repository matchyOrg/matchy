<template>
  <v-form>
    <v-text-field
      v-model="searchParams.title"
      :label="t('components.edit-event.title-input')"
      name="title"
      :placeholder="t('components.edit-event.title-placeholder')"
    />
    <v-text-field
      v-model="searchParams.location"
      :label="t('components.edit-event.location-input')"
      name="event-location"
      :placeholder="t('components.edit-event.location-placeholder')"
    />
    <v-text-field
      v-model="searchParams.maxParticipants"
      type="number"
      min="2"
      :label="t('components.edit-event.max-participants')"
      name="max-participants"
      :placeholder="t('components.edit-event.max-participants-placeholder')"
    />
    <v-row>
      <v-col cols="6">
        <v-text-field
          :model-value="searchParams.fromDate"
          is-link
          readonly
          name="datePicker"
          :label="t('components.edit-event.date-label')"
          :placeholder="t('components.edit-event.date-placeholder')"
          @click="showDatePickerA = true"
        />
        <v-dialog v-model="showDatePickerA">
          <v-card class="pa-8"
            ><input type="date" v-model="searchParams.fromDate"
          /></v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :model-value="searchParams.toDate"
          is-link
          readonly
          name="datePicker"
          :label="t('components.edit-event.date-label')"
          :placeholder="t('components.edit-event.date-placeholder')"
          @click="showDatePickerB = true"
        />
        <v-dialog v-model="showDatePickerB">
          <v-card class="pa-8"
            ><input type="date" v-model="searchParams.toDate"
          /></v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-text-field />

    <v-text-field />
  </v-form>
</template>
<script setup lang="ts">
import type { EventSearchParams } from "@/services/eventService";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const showDatePickerA = ref<boolean>(false);
const showDatePickerB = ref<boolean>(false);

const searchParams = ref<EventSearchParams>({
  title: "",
  location: "",
  maxParticipants: "",
  fromDate: Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()),
  toDate: Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()),
  groupNameA: "",
  groupNameB: "",
});
</script>
