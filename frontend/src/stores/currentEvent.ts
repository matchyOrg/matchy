import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useCurrentEventStore = defineStore("current-event", () => {
  const currentEventId = useStorage("current-event-id", "");
  const hasEvent = computed(() => currentEventId.value !== "");

  function getCurrentId() {
    return currentEventId;
  }

  function setCurrentId(id: number) {
    currentEventId.value = id.toString();
  }

  return { hasEvent, getCurrentId, setCurrentId };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCurrentEventStore, import.meta.hot)
  );
}
