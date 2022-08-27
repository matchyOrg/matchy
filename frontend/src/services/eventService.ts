import { Temporal } from "@js-temporal/polyfill";
import type { useAuthStore } from "@/stores/auth";
import { supabase } from "./supabase";
import { dateXHoursAgo, timestamptzToTemporalZonedDateTime } from "./utils/datetime";

// TODO: Combine EventInfo and EditEventInfo with Partials
export interface EventInfo {
  id: number;
  organizer: string;
  title: string;
  description: string;
  header_image?: string;
  datetime: Temporal.ZonedDateTime;
  location: string;
  max_participants: number;
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
  is_ended: boolean;
  is_cancelled: boolean;
}

export interface EditEventInfo {
  title: string;
  description: string;
  header_image?: string;
  header_image_file?: File;
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
  async function fetchEvents(): Promise<EventInfo[]> {
    const anHourAgo = dateXHoursAgo(1);

    const { data: events, error } = await supabase
      .from("events")
      .select(
        "id, organizer, title, description, datetime, location, max_participants, header_image, is_ended, is_cancelled, event_group_pair"
      )
      .not("is_cancelled", "eq", true)
      .not("is_ended", "eq", true)
      .gt("datetime", anHourAgo.toInstant().toString())
      .order("datetime", { ascending: true });

    if (error) {
      errorToast(error);
      throw error;
    }
    if (!events) {
      errorToast("Failed to fetch events");
      throw new Error("Failed to fetch events");
    }
    // datetime is sent as string, need to parse it to Temporal ZonedDateTime datatype
    console.log(events[0].datetime);
    const parsedEvents = events.map((e) => ({
      ...e,
      datetime: Temporal.Instant.from(e.datetime).toZonedDateTimeISO(
        Temporal.Now.timeZone()
      ),
    }));

    return parsedEvents;
  }

  async function fetchUserEvents(): Promise<EventInfo[]> {
    const anHourAgo = dateXHoursAgo(1);

    const { data: events, error } = await supabase
      .from("events")
      .select(
        "id, organizer, title, description, datetime, location, max_participants, header_image, is_ended, is_cancelled, event_group_pair, event_registrations!inner(*)"
      )
      .eq("event_registrations.user_id", authStore.user?.id)
      .not("is_cancelled", "eq", true)
      .not("is_ended", "eq", true)
      .gt("datetime", anHourAgo.toInstant().toString())
      .order("datetime", { ascending: true });

    if (error) {
      errorToast(error);
      throw error;
    }

    if (events === null) throw new Error("Could not load user's events");

    return events?.map((e) => ({
      ...e,
      datetime: timestamptzToTemporalZonedDateTime(e.datetime),
    }));
  }

  async function fetchEventById(eventId: number): Promise<EventInfo> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Event with this ID does not exist");
    }
    const fetchedEvent = {
      ...data,
      datetime: timestamptzToTemporalZonedDateTime(data.datetime),
    };

    return fetchedEvent;
  }
  // SELECT
  // ...

  // INSERT
  async function createEvent(eventData: EditEventInfo) {
    console.log("Called useEventService.createEvent()", eventData);

    if (!authStore.user) {
      errorToast("Please log in first");
      throw Error("User is not logged in");
    }
    let creationError;
    if (eventData.uses_groups) {
      if (!eventData.event_groups)
        throw Error(
          "Event is indicated to use groups, but no groups were provided"
        );
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
      creationError = error;
    } else {
      const { error } = await supabase.from("events").insert({
        ...eventData,
        datetime: eventData.datetime.toString(),
        event_group_pair: undefined,
      });
      creationError = error;
    }

    if (creationError) throw creationError;
    successToast("Creation of new event successful");
  }

  // UPDATE
  // ...

  // DELETE
  // ...

  return {
    createEvent,
    fetchEvents,
    fetchEventById,
    fetchUserEvents,
  };
}
