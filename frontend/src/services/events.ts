import type { useUserStore } from "@/stores/user";
import type { Temporal } from "@js-temporal/polyfill";
import { supabase } from "./supabase";

export interface EditEventInfo {
  title: string;
  description: string;
  date_time: Temporal.ZonedDateTime;
  event_location: string;
  event_groups?: {
    groupA: {
      title: string;
      description: string;
    };
    groupB: {
      title: string;
      description: string;
    };
  };
}

export function useEvents(userStore: ReturnType<typeof useUserStore>) {
  const createEvent = async (eventData: EditEventInfo) => {
    if (!userStore.user) throw new Error("User not loaded");

    let eventGroupPairId: null | number = null;
    if (eventData.event_groups) {
      const { data: groups, error: errorEventGroups } = await supabase.from("event_group").insert([
        {
          title: eventData.event_groups.groupA.title,
          description: eventData.event_groups.groupA.description,
        },
        {
          title: eventData.event_groups.groupB.title,
          description: eventData.event_groups.groupB.description,
        },
      ]);
      if (errorEventGroups) throw errorEventGroups;
      if (groups.length !== 2) throw new Error("Event groups not created, length was " + groups.length);

      const { data: groupPair, error: errorEventGroupPair } = await supabase
        .from("event_group_pair")
        .insert({
          group_a: groups[0].id,
          group_b: groups[1].id,
        })
        .single();
      if (errorEventGroupPair) throw errorEventGroupPair;

      eventGroupPairId = groupPair.id;
    }

    const { error: errorEvent } = await supabase.from("matchy_event").insert(
      {
        organizer: userStore.user.id,
        title: eventData.title,
        description: eventData.description,
        date_time: eventData.date_time.toString(),
        event_location: eventData.event_location,
        event_groups: eventGroupPairId ? eventGroupPairId : undefined,
      },
      {
        returning: "minimal",
      }
    );

    if (errorEvent) throw errorEvent;
  };

  // TODO: Update event
  // Make sure to clean up potentially stray groups. Or change the data model.

  return {
    createEvent,
  };
}
