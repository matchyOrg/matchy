<template>
  <v-row v-if="event_groups">
    <v-col cols="6" class="rounded-lg text-center">
      <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
        <span class="d-block mb-4 font-weight-bold">{{
          event_groups.groupA.title
        }}</span>
        <span
          class="d-block px-2 text-h5 font-weight-bold"
          v-if="groupACounts !== undefined"
          >{{ groupACounts.total }} / {{ totalRegisteredCount }}</span
        >
        <span class="d-block mb-4 text-body-2 text-grey">{{
          t("pages.dashboard.prepare.registered")
        }}</span>
        <span
          class="d-block px-2 text-h5 font-weight-bold"
          v-if="groupACounts !== undefined"
          >{{ groupACounts.present }} / {{ groupACounts.total }}</span
        >
        <span class="d-block pa-2" v-else>
          <v-progress-circular indeterminate />
        </span>
        <span class="d-block text-body-2 text-grey">{{
          t("pages.dashboard.prepare.present")
        }}</span>
      </v-sheet>
    </v-col>
    <v-col cols="6" class="text-center">
      <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
        <span class="d-block mb-4 font-weight-bold">{{
          event_groups.groupB.title
        }}</span>
        <span
          class="d-block text-h5 font-weight-bold"
          v-if="groupBCounts !== undefined"
          >{{ groupBCounts.total }} / {{ totalRegisteredCount }}</span
        >
        <span class="d-block mb-4 text-body-2 text-grey">{{
          t("pages.dashboard.prepare.registered")
        }}</span>
        <span
          class="d-block text-h5 font-weight-bold"
          v-if="groupBCounts !== undefined"
          >{{ groupBCounts.present }} / {{ groupBCounts.total }}</span
        >
        <span class="d-block pa-2" v-else>
          <v-progress-circular indeterminate />
        </span>
        <span class="d-block text-body-2 text-grey">{{
          t("pages.dashboard.prepare.present")
        }}</span>
      </v-sheet>
    </v-col>
  </v-row>
  <v-sheet v-else class="pa-4 d-flex align-center justify-space-around">
    <div class="text-center">
      <span
        class="d-block px-2 text-h5 font-weight-bold"
        v-if="totalPresentCount !== undefined"
        >{{ totalPresentCount }}</span
      >
      <span class="d-block pa-2" v-else>
        <v-progress-circular indeterminate />
      </span>
      <span class="d-block px-2">{{
        t("pages.dashboard.prepare.present")
      }}</span>
    </div>
    <div class="text-center">
      <span
        class="d-block px-2 text-h5 font-weight-bold"
        v-if="totalRegisteredCount !== undefined"
        >{{ totalRegisteredCount }}</span
      >
      <span class="d-block pa-2" v-else>
        <v-progress-circular indeterminate />
      </span>
      <span class="d-block px-2">{{
        t("pages.dashboard.prepare.registered")
      }}</span>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { GroupPair } from "@/services/eventService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface GroupCount {
  total: number;
  present: number;
}

const props = defineProps<{
  event_groups?: GroupPair;
  totalRegisteredCount?: number;
  totalPresentCount?: number;
  groupACounts?: GroupCount;
  groupBCounts?: GroupCount;
}>();
</script>
