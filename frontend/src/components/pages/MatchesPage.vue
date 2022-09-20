<template>
  <teleport to="#nav-title">My Matches</teleport>
  <v-main>
    <v-container class="pt-8 d-flex flex-column align-center">
      <v-expansion-panels
        v-if="eventMatches.length > 0"
        multiple
        v-model="panels"
      >
        <v-expansion-panel
          class="matchy-expansion-panel"
          elevation="0"
          v-for="event in eventMatches"
          :key="event.id"
        >
          <v-expansion-panel-title>
            <span class="d-block text-h6">
              {{ event.title }}
            </span>
          </v-expansion-panel-title>
          <v-expansion-panel-text v-if="!event.resultsPublished">
            <span class="text-grey-darken-3">
              Matches for this event have not been published
            </span>
            <span class="d-block text-grey-darken-1">
              You will be notified when they are
            </span>
          </v-expansion-panel-text>
          <v-expansion-panel-text v-else-if="event.matches.length === 0">
            <span class="text-grey">You had no matches for this event</span>
          </v-expansion-panel-text>
          <v-expansion-panel-text v-else>
            <v-table>
              <tbody>
                <tr v-for="match in event.matches" :key="match.email">
                  <td>{{ match.fullName ?? "unknown" }}</td>
                  <td>{{ match.email }}</td>
                  <td>{{ match.description }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-else-if="!loading" class="text-h6 font-weight-bold">
        You haven't participated in any events
      </div>
      <v-progress-circular v-else indeterminate />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useMatchService, type EventMatches } from "@/services/matchService";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const matchesService = useMatchService(authStore);
const eventMatches = ref<EventMatches[]>([]);
const panels = ref<number[]>([]);
const loading = ref(true);

onMounted(async () => {
  eventMatches.value = await matchesService.getMatches();
  panels.value = Array(eventMatches.value.length)
    .fill(0)
    .map((_, i) => i);
  loading.value = false;
});
</script>

<style scoped>
.matchy-expansion-panel::after {
  opacity: 1 !important;
}
.matchy-expansion-panel:deep(.v-expansion-panel-title--active
    > .v-expansion-panel-title__overlay) {
  opacity: 0;
}
</style>
