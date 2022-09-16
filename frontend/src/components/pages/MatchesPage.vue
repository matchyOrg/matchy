<template>
  <teleport to="#nav-title">My Matches</teleport>
  <v-main>
    <v-container class="pt-16">
      <v-expansion-panels multiple v-model="panels">
        <v-expansion-panel
          elevation="0"
          v-for="event in eventMatches"
          :key="event.id"
        >
          <v-expansion-panel-title>{{ event.title }}</v-expansion-panel-title>
          <v-expansion-panel-text v-if="event.matches.length === 0">
            <img
              src="https://i.kym-cdn.com/entries/icons/mobile/000/039/393/cover2.jpg"
              height="50"
              width="50"
            />No bitches?</v-expansion-panel-text
          >
          <v-expansion-panel-text>
            <div
              class="d-flex"
              v-for="match in event.matches"
              :key="match.email"
            >
              <span class="d-block">{{ match.fullName }}</span
              ><span class="d-block">{{ match.email }}</span
              ><span class="d-block">{{ match.description }}</span>
            </div>
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
