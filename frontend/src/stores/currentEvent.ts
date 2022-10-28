import { acceptHMRUpdate, defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/services/supabase";
import { Temporal } from "@js-temporal/polyfill";
import type { definitions } from "@/services/generated/supabase-types";
import { useAuthStore } from "./auth";
import type { EventInfo } from "@/services/eventService";
import { timestampToInstant } from "@/services/utils/datetime";

export const useCurrentEventStore = defineStore("current-event", () => {
  const currentEventId = useStorage("current-event-id", ""); // TODO: Refactor to use localStorage
  const hasEvent = computed(() => currentEventId.value != "");

  function getCurrentId() {
    return currentEventId.value;
  }

  function setCurrentId(id: number | null) {
    currentEventId.value = id + "";
  }

  async function getCurrentEvent(): Promise<EventInfo | null> {
    if (!hasEvent) return null;
    const { data: eventData, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", currentEventId.value)
      .maybeSingle();
    if (error) throw error;
    if (eventData === null) {
      return null;
    }
    const event = {
      ...eventData,
      datetime: timestampToInstant(eventData.datetime),
    };
    return event;
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

  async function endCurrentEvent() {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const { error } = await supabase
      .from("events")
      .update({ is_ended: true })
      .match({ id: currentEventId.value });
    if (error) throw error;
    setCurrentId(null);
  }

  async function confirmPresence(id: number) {
    const authStore = useAuthStore();
    if (!authStore.user)
      throw new Error("User must be logged in to confirm presence");
    // event_id, user_id pair uniquely identifies a registration
    const { error } = await supabase
      .from("event_registrations")
      .update({ present: true })
      .match({ event_id: id, user_id: authStore.user.id });
    if (error) throw error;
    setCurrentId(id);
  }

  async function startNewRound(
    duration: number
  ): Promise<definitions["event_rounds"]> {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const now = Temporal.Now.instant();
    const endTime = now.add({ milliseconds: duration });
    const { error, data } = await supabase.from("event_rounds").insert(
      {
        event_id: +currentEventId.value,
        start_timestamp: now.toString(),
        end_timestamp: endTime.toString(),
      },
      { returning: "representation" }
    );
    if (error) throw error;
    if (!data) throw new Error("Inserted event round was not returned");
    return data[0];
  }

  async function getCurrentOngoingRound(): Promise<
    definitions["event_rounds"] | null
  > {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const { data, error } = await supabase
      .from("event_rounds")
      .select("*")
      .eq("event_id", currentEventId.value)
      .order("start_timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function createPair(otherUser: string, eventRound: number) {
    const authStore = useAuthStore();
    if (!authStore.user) throw new Error("User is not logged in");
    const { error } = await supabase.from("event_user_pairs").insert({
      event_round: eventRound,
      main_user: authStore.user.id,
      other_user: otherUser,
    });
    if (error) throw error;
  }

  async function getCurrentPair(): Promise<
    definitions["event_user_pairs"] | null
  > {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const authStore = useAuthStore();
    if (!authStore.user)
      throw new Error("User must be logged in to confirm presence");
    const now = Temporal.Now.instant();

    const { data, error } = await supabase
      .from("event_user_pairs")
      .select("*, event_rounds!inner(event_id, end_timestamp)")
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: valid because of foreign key
      .eq("event_rounds.event_id", currentEventId.value)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: valid because of foreign key
      .gte("event_rounds.end_timestamp", now.toString())
      .limit(1)
      .or(
        `main_user.eq.${authStore.user?.id},other_user.eq.${authStore.user?.id}`
      )
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function vote(pairId: number, like: boolean) {
    const authStore = useAuthStore();
    if (!authStore.user)
      throw new Error("User must be logged in to confirm presence");
    const { error } = await supabase
      .from("votes")
      .insert({ user_id: authStore.user.id, user_pair_id: pairId, vote: like });
    if (error) throw error;
  }

  async function getCurrentRoundInfo(): Promise<
    | (definitions["event_rounds"] & {
        pairId: number | null;
        hasVoted: boolean;
      })
    | null
  > {
    if (!currentEventId.value) throw new Error("There is no current event.");
    const authStore = useAuthStore();
    if (!authStore.user) return null;
    // types are completely useless here...
    const { data, error } = await supabase
      .from<any>("event_rounds")
      .select(
        `*, pair:event_user_pairs(id, votes(vote)).or=(main_user.eq.${authStore.user.id},other_user.eq.${authStore.user.id})`
      )
      .eq("event_id", currentEventId.value)
      .order("start_timestamp", { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    const { pair } = data;
    const pairId = pair.length === 0 ? null : pair[0].id;
    const hasVoted = pairId !== null && pair[0].votes.length !== 0;
    return {
      id: data.id,
      event_id: data.event_id,
      start_timestamp: data.start_timestamp,
      end_timestamp: data.end_timestamp,
      pairId,
      hasVoted,
    };
  }

  async function getNumberOfPairsThisRound(roundId: number): Promise<number> {
    const { count, error } = await supabase
      .from("event_user_pairs")
      .select("id", { count: "exact" })
      .eq("event_round", roundId);
    if (error) throw error;
    return count ?? 0;
  }

  async function getNumberOfVotesThisRound(roundId: number): Promise<number> {
    const { count, error, data } = await supabase
      .from<any>("votes")
      .select("id, event_user_pairs!inner(*)", { count: "exact" })
      .eq("event_user_pairs.event_round", roundId);
    console.log(data);

    if (error) throw error;
    return count ?? 0;
  }

  async function getTotalNumberOfParticipants(): Promise<number> {
    const { count, error } = await supabase
      .from("event_registrations")
      .select("id", { count: "exact" })
      .eq("event_id", +currentEventId.value)
      .eq("present", true);
    if (error) throw error;
    return count ?? 0;
  }

  return {
    hasEvent,
    getCurrentId,
    setCurrentId,
    startEvent,
    startNewRound,
    getCurrentOngoingRound,
    getCurrentEvent,
    confirmPresence,
    createPair,
    getCurrentPair,
    vote,
    getCurrentRoundInfo,
    endCurrentEvent,
    getNumberOfPairsThisRound,
    getNumberOfVotesThisRound,
    getTotalNumberOfParticipants,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCurrentEventStore, import.meta.hot)
  );
}
