<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <v-main>
    <v-container>
      <page-title>{{ t("pages.event-edit.title") }}</page-title>

      <div v-if="matchyEvent">
        <!-- same as create event but excludes some fields -->
        <EditEvent
          v-model="matchyEvent"
          :exclude-fields="['event_groups', 'datetime', 'max_participants']"
        />

        <!-- update button -->
        <section class="d-flex flex-column align-center mt-3">
          <v-btn
            class="mb-4"
            size="x-large"
            color="green"
            variant="tonal"
            append-icon="mdi-content-save-outline"
            type="submit"
            minWidth="20rem"
            @click="submit"
          >
            {{ t("pages.event-edit.update") }}
          </v-btn>
        </section>
      </div>

      <v-progress-circular indeterminate class="spinner ma-auto" v-else />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import EditEvent from "@/components/EditEvent.vue";
import { useEventService, type EditEventInfo } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const eventService = useEventService(authStore);
const matchyEvent = ref<EditEventInfo>();

const submit = async () => {
  try {
    if (!matchyEvent.value) {
      errorToast("There's no event to submit");
      return;
    }
    await eventService.updateEvent(+route.params.id, matchyEvent.value);
    successToast("Event was successfully updated");
    router.push({ name: "event-detail", params: { id: +route.params.id } });
  } catch (e) {
    errorToast(e);
  }
};

watch(
  () => route.params.id,
  async () => {
    matchyEvent.value = undefined;
    if (isNaN(+route.params.id)) {
      errorToast(t("shared.events.invalid-id"));
      router.back();
      return;
    }
    try {
      const data = await eventService.fetchEventById(+route.params.id);
      matchyEvent.value = {
        ...data,
        uses_groups: !!data.event_groups,
        event_groups: data.event_groups ?? {
          groupA: { title: "", description: "" },
          groupB: { title: "", description: "" },
        },
      };
    } catch (e) {
      console.log(e);
      errorToast(t("shared.events.event-load-error"));
      router.back();
    }
  },
  { immediate: true, flush: "post" }
);
</script>
