<template>
  <v-main>
    <v-container>
      <header>Search Events</header>
      <br />
      <div v-if="eventPage.length <= 0 && fetched">
        <b>There are currently no Events in our Database!</b>
      </div>
      <div v-else-if="eventPage.length <= 0 && !fetched">
        <b>Loading Event Entries, please wait...</b>
      </div>
      <div v-else class="">
        <event-list-item
          v-for="event in eventPage"
          :key="event.id"
          :matchy-event="event"
          :showInfo="true"
          :showImage="true"
        >
        </event-list-item>
        <v-pagination
          :length="Math.ceil(totalSize / pageSize)"
          v-model="vuetifyAutismPageIndex"
        ></v-pagination>
      </div>
    </v-container>
  </v-main>
</template>
<script setup lang="ts">
import type { EventInfo, EventSearchParams } from "@/services/eventService";
import { Temporal } from "@js-temporal/polyfill";
import { useI18n } from "vue-i18n";
import { useEventService } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
const { t } = useI18n();

const authStore = useAuthStore();
const eventService = useEventService(authStore);
const eventPage = ref<EventInfo[]>([]);
const pageIndex = ref(0);
const vuetifyAutismPageIndex = computed({
  get() {
    return pageIndex.value + 1;
  },
  set(value) {
    pageIndex.value = value - 1;
  },
});
const pageSize = ref(10);
const totalSize = ref(0);
const fetched = ref(false);

async function fetchPageItems(pageIndex: number, size: number) {
  const { events, total } = await eventService.fetchEvents({
    pagination: { pageIndex, size },
  });
  eventPage.value = events;
  totalSize.value = total;
}

onMounted(async () => {
  await fetchPageItems(pageIndex.value, pageSize.value);
  fetched.value = true;
});

watch(pageIndex, () => {
  fetchPageItems(pageIndex.value, pageSize.value);
});

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
