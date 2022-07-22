import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

/**
 * For stuff that doesn't belong in any other stores
 */
export const useCurrentEventStore = defineStore("current-event", () => {
  const eventId = useStorage("current-event-id", "");
  const hasEvent = computed(() => eventId.value !== "");
  return { hasEvent };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentEventStore, import.meta.hot));
}
