import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/services/supabase";

export const useCurrentEventStore = defineStore("current-event", () => {
  const currentEventId = useStorage("current-event-id", "");
  const hasEvent = computed(() => currentEventId.value !== "");

  function getCurrentId() {
    return currentEventId.value;
  }

  function setCurrentId(id: number) {
    currentEventId.value = id.toString();
  }

  async function startEvent(id: number) {
    const { error } = await supabase
      .from("events")
      .update({ is_started: true })
      .match({ id });
    if (error) {
      console.log(error);
      throw error;
    }
    setCurrentId(id);
  }

  return { hasEvent, getCurrentId, setCurrentId, startEvent };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCurrentEventStore, import.meta.hot)
  );
}
