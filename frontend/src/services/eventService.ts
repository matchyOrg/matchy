import { Temporal } from "@js-temporal/polyfill";
import type { useAuthStore } from "@/stores/auth";
import { supabase } from "./supabase";
import {
  dateXHoursAgo,
  timestamptzToTemporalZonedDateTime,
} from "./utils/datetime";
import { nanoid } from "nanoid";

export interface GroupPair {
  groupA: {
    title: string;
    description: string;
  };
  groupB: {
    title: string;
    description: string;
  };
}

export interface EventInfo {
  id: number;
  organizer: string;
  title: string;
  description: string;
  header_image?: string;
  datetime: Temporal.ZonedDateTime;
  location: string;
  max_participants: number;
  event_groups?: GroupPair;
  is_ended: boolean;
  is_cancelled: boolean;
}

export interface EditEventInfo
  extends Omit<EventInfo, "id" | "organizer" | "is_ended" | "is_cancelled"> {
  headerImageFile?: File;
  uses_groups: boolean;
  event_groups: GroupPair;
}

export function useEventService(authStore: ReturnType<typeof useAuthStore>) {
  async function fetchEvents(): Promise<EventInfo[]> {
    const anHourAgo = dateXHoursAgo(1);

    const { data: events, error } = await supabase
      .from("events")
      .select(
        "*, event_groups:event_group_pairs(groupA:group_a(title, description), groupB:group_b(title, description))"
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
        "*, event_group_pair:event_group_pairs(groupA:group_a(title, description), groupB:group_b(title, description)), event_registrations!inner(*)"
      )
      // TODO: remove once we find a way to correctly type this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: with the inner join this is valid
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
      .select(
        "*, event_groups:event_group_pairs(groupA:group_a(title, description), groupB:group_b(title, description))"
      )
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

    // the user has selected a new image header
    if (eventData.headerImageFile) {
      // collision rate of 1 in a million at 24k, 1 in 1000 at 750k
      // easily replaceable should we ever need to
      const fileName = nanoid();
      const { data, error } = await supabase.storage
        .from("event-header-images")
        .upload(fileName, eventData.headerImageFile, {
          contentType: "image/png",
        });

      if (error) throw error;
      if (!data || !data.Key) {
        throw new Error("Received no data after uploading image");
      }
      // set the new image path
      eventData.header_image = data.Key;
    }

    let creationError;
    if (eventData.uses_groups) {
      if (!eventData.event_groups)
        throw Error(
          "Event is indicated to use groups, but no groups were provided"
        );
      const { error } = await supabase.rpc("create_event_with_groups", {
        title: eventData.title,
        description: eventData.description,
        header_image: eventData.header_image,
        datetime: eventData.datetime.toInstant().toString(),
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
