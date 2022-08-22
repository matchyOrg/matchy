import type { Temporal } from "@js-temporal/polyfill";
import type { useAuthStore } from "@/stores/auth";
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

export function useEventService(authStore: ReturnType<typeof useAuthStore>) {
  // SELECT
  // ...

  // INSERT
  const createEvent = async (eventData: EditEventInfo) => {
    if (!authStore.user) {
      throw Error("User is not logged in");
    }
    const { error } = await supabase.rpc("create_event_with_groups", {
      organizer: authStore.user.id,
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

  // UPDATE
  // ...

  // DELETE
  // ...

  return {
    createEvent,
  };
}
