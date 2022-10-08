<template>
  <v-main>
    <v-container>
      <page-title>{{ t("pages.event-create.title") }}</page-title>
      <edit-event v-model="matchyEvent" />
      <v-btn @click="submit">{{ t("pages.event-create.submit") }}</v-btn>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useEventService, type EditEventInfo } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const eventService = useEventService(useAuthStore());
const router = useRouter();

const submit = async () => {
  try {
    const id = await eventService.createEvent(matchyEvent);
    successToast(t("pages.event-create.success"));
    router.push({ name: "event-detail", params: { id } });
  } catch (e) {
    errorToast(e, t("pages.event-create.error"));
  }
};

const matchyEvent = reactive({
  title: "",
  description: "",
  header_image: undefined,
  max_participants: 50,
  datetime: Temporal.Now.instant().add({ minutes: 1 }),
  location: "",
  uses_groups: true,
  event_groups: {
    groupA: {
      title: "",
      description: "",
    },
    groupB: {
      title: "",
      description: "",
    },
  },
} as EditEventInfo);
</script>
