<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <v-main>
    <v-container>
      <page-title>{{ t("pages.event-search.title") }}</page-title>
      <div>
        <div v-if="eventPage.length <= 0">
          <!--TODO: Add loading indicator using fetchPageItems.loading-->
          <b>{{ t("pages.event-search.no-results") }}</b>
        </div>
        <event-list-item
          class="mb-6"
          v-for="event in eventPage"
          :key="event.id"
          :matchy-event="event"
          :showInfo="true"
          :showImage="true"
          :to="'/events/' + event.id"
          :show-divider="true"
        >
        </event-list-item>
        <!--TODO: Add loading indicator using fetchPageItems.loading-->
        <v-pagination
          :length="Math.ceil(totalSize / pageSize)"
          v-model="vPageIndex"
        ></v-pagination>
      </div>
    </v-container>
  </v-main>
</template>
<script setup lang="ts">
import type { EventInfo } from "@/services/eventService";
import { useI18n } from "vue-i18n";
import { useEventService } from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
const { t } = useI18n();

const authStore = useAuthStore();
const eventService = useEventService(authStore);
const eventPage = ref<EventInfo[]>([]);
const pageIndex = ref(0);
const vPageIndex = computed({
  get() {
    return pageIndex.value + 1;
  },
  set(value) {
    pageIndex.value = value - 1;
  },
});
const pageSize = ref(10);
const totalSize = ref(0);

const fetchPageItems = asyncLoading(async (pageIndex: number, size: number) => {
  const { events, total } = await eventService.fetchEvents({
    pagination: { pageIndex, size },
  });
  eventPage.value = events;
  totalSize.value = total;
});

onMounted(async () => {
  await fetchPageItems.handler(pageIndex.value, pageSize.value);
});

watch(pageIndex, () => {
  fetchPageItems.handler(pageIndex.value, pageSize.value);
});
</script>
