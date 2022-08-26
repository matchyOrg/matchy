<template>
  <teleport to="#nav-title">Edit Event</teleport>
  <v-main>
    <v-container>
      <EditEvent v-if="matchyEvent" v-model="matchyEvent" />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import EditEvent from "@/components/EditEvent.vue";
import { useEventService, type EditEventInfo } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const eventService = useEventService(authStore);
const matchyEvent = ref<EditEventInfo>();
const loadingEvent = ref(true);

watch(
  () => route.params.id,
  async () => {
    if (isNaN(+route.params.id)) {
      errorToast("Uh oh, looks like that is not a valid event id");
      router.back();
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
      errorToast(
        "The event could not be loaded... Going back to previous page."
      );
      router.back();
    }
    loadingEvent.value = false;
  },
  { immediate: true }
);
</script>
