<template>
  <teleport to="#nav-title">{{ t("pages.event-edit.title") }}</teleport>
  <v-main>
    <v-container class="flex flex-col justify-center">
      <div v-if="!loadingEvent">
        <EditEvent v-model="matchyEvent" :exclude-fields="['event_groups']" />
        <v-btn color="success" @click="submit">Submit</v-btn>
      </div>
      <v-progress-circular indeterminate class="spinner" v-else />
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
const loadingEvent = ref(true);

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
    loadingEvent.value = false;
  },
  { immediate: true, flush: "post" }
);
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.spinner {
  margin: auto;
}
</style>
