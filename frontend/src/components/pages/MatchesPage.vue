<template>
  <teleport to="#nav-title">My Matches</teleport>
  <v-main>
    <v-container class="pt-16">
      <v-expansion-panels multiple v-model="panels">
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
          <v-expansion-panel-text v-if="event.matches.length === 0">
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

onMounted(async () => {
  eventMatches.value = await matchesService.getMatches();
  panels.value = Array(eventMatches.value.length)
    .fill(0)
    .map((_, i) => i);
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
