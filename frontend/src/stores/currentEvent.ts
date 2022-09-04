import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/services/supabase";
import { Temporal } from "@js-temporal/polyfill";
import type { definitions } from "@/services/supabase-types";

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

  async function startNewRound(
    duration: number
  ): Promise<definitions["event_rounds"]> {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const now = Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone());
    const endTime = now.add({ milliseconds: duration });
    const { error, data } = await supabase.from("event_rounds").insert(
      {
        event_id: +currentEventId.value,
        start_timestamp: now.toInstant().toString(),
        end_timestamp: endTime.toInstant().toString(),
      },
      { returning: "representation" }
    );
    if (error) throw error;
    if (!data) throw new Error("Inserted event round was not returned");
    return data[0];
  }

  return { hasEvent, getCurrentId, setCurrentId, startEvent, startNewRound };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCurrentEventStore, import.meta.hot)
  );
}
