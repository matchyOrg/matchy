/**
 * This component contains things that doesn't belong in any other stores
 */

import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useCurrentEventStore = defineStore("current-event", () => {
  const eventId = useStorage("current-event-id", "");
  const hasEvent = computed(() => eventId.value !== "");
  return { hasEvent };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentEventStore, import.meta.hot));
}
