import type { useUserStore } from "@/stores/user";
import type { Temporal } from "@js-temporal/polyfill";
import { supabase } from "./supabase";

export interface EditEventInfo {
  title: string;
  description: string;
  datetime: Temporal.ZonedDateTime;
  location: string;
  max_participants: number;
  uses_groups: boolean;
  event_groups: {
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
    if (!userStore.user) {
      throw Error("User is not logged");
    }
    const { error } = await supabase.rpc("create_event_with_groups", {
      organizer: userStore.user.id,
      title: eventData.title,
      description: eventData.description,
      header_image: null,
      datetime: eventData.datetime,
      location: eventData.location,
      max_participants: eventData.max_participants,
      groupATitle: eventData.event_groups.groupA.title,
      groupADescription: eventData.event_groups.groupA.description,
      groupBTitle: eventData.event_groups.groupB.title,
      groupBDescription: eventData.event_groups.groupB.description,
    });

    if (error) throw error;
  };

  // TODO: Update event

  return {
    createEvent,
  };
}
