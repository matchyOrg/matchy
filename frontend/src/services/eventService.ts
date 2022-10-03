import { Temporal } from "@js-temporal/polyfill";
import type { useAuthStore } from "@/stores/auth";
import { supabase } from "./supabase";
import {
  dateXHoursAgo,
  timestamptzToTemporalZonedDateTime,
} from "./utils/datetime";
import type { PostgrestError } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export interface Group {
  id?: number;
  title: string;
  description: string;
}

export interface GroupPair {
  groupA: Group;
  groupB: Group;
}

export interface EventInfo {
  id: number;
  organizer?: string;
  title: string;
  description: string;
  header_image?: string | null;
  datetime: Temporal.ZonedDateTime;
  location: string;
  max_participants: number;
  event_groups?: GroupPair;
  is_ended: boolean;
  is_cancelled: boolean;
  is_started: boolean;
  results_published: boolean;
}

export interface EditEventInfo
  extends Omit<
    EventInfo,
    "id" | "organizer" | "is_ended" | "is_cancelled" | "is_started"
  > {
  headerImageFile?: File;
  uses_groups: boolean;
  event_groups: GroupPair;
}

export interface EventRegistration {
  id: number;
  user_id: string;
  event_id: number;
  group_id?: number;
  present: boolean;
}

export interface EventSearchParams {
  title?: string;
  location?: string;
  maxParticipants?: string;
  fromDate?: Temporal.ZonedDateTime;
  toDate?: Temporal.ZonedDateTime;
  groupNameA?: string;
  groupNameB?: string;
}

export type CreateEventRegistration = Omit<EventRegistration, "id" | "present">;

export function useEventService(authStore: ReturnType<typeof useAuthStore>) {
  function getPagination(pageIndex: number, size: number) {
    const from = pageIndex * size;
    const to = from + size;

    return { from, to };
  }

  async function fetchEvents(options?: {
    pagination?: { pageIndex: number; size: number };
  }): Promise<{ events: EventInfo[]; total: number }> {
    const anHourAgo = dateXHoursAgo(1);

    let query = supabase
      .from("events")
      .select(
        "*, event_groups:event_group_pairs(groupA:group_a(id, title, description), groupB:group_b(id, title, description))",
        { count: "exact" }
      )
      .not("is_cancelled", "eq", true)
      .not("is_ended", "eq", true)
      .gt("datetime", anHourAgo.toInstant().toString())
      .order("datetime", { ascending: true });
    if (options?.pagination) {
      const { from, to } = getPagination(
        options?.pagination?.pageIndex,
        options?.pagination?.size
      );
      query = query.range(from, to - 1);
    }

    const { data: events, count, error } = await query;
    if (error) {
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

    return { events: parsedEvents, total: count ?? 0 };
  }

  async function fetchUserEvents(): Promise<EventInfo[]> {
    const anHourAgo = dateXHoursAgo(1);

    const { data: events, error } = await supabase
      .from("events")
      .select(
        "*, event_group_pair:event_group_pairs(groupA:group_a(id, title, description), groupB:group_b(id, title, description)), event_registrations!inner(*)"
      )
      // TODO: remove once we find a way to correctly type this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: with the inner join this is valid
      .eq("event_registrations.user_id", authStore.user?.id)
      .not("is_cancelled", "eq", true)
      .not("is_ended", "eq", true)
      .or(
        `datetime.gt.${anHourAgo
          .toInstant()
          .toString()},and(is_started.eq.true,is_ended.eq.false)`
      )
      .order("datetime", { ascending: true });

    if (error) {
      throw error;
    }

    if (events === null) throw new Error("Could not load user's events");

    return events?.map((e) => ({
      ...e,
      datetime: timestamptzToTemporalZonedDateTime(e.datetime),
    }));
  }

  async function fetchOrganizerEvents(): Promise<EventInfo[]> {
    if (!authStore.user)
      throw new Error("User must be logged to fetch their events");
    const anHourAgo = dateXHoursAgo(1);

    const { data: events, error } = await supabase
      .from("events")
      .select(
        "*, event_group_pair:event_group_pairs(groupA:group_a(id, title, description), groupB:group_b(id, title, description))"
      )
      .eq("organizer", authStore.user.id)
      .not("is_cancelled", "eq", true)
      .not("is_ended", "eq", true)
      .or(
        `datetime.gt.${anHourAgo
          .toInstant()
          .toString()},and(is_started.eq.true,is_ended.eq.false)`
      )
      .order("datetime", { ascending: true });

    if (error) {
      throw error;
    }

    if (events === null) throw new Error("Could not load user's events");

    return events.map((e) => ({
      ...e,
      datetime: timestamptzToTemporalZonedDateTime(e.datetime),
    }));
  }

  async function fetchEventById(eventId: number): Promise<EventInfo> {
    const { data, error } = await supabase
      .from("events")
      .select(
        "*, event_groups:event_group_pairs(groupA:group_a(id, title, description), groupB:group_b(id, title, description))"
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

  /**
   * Uploads a new header image to storage
   * @param headerImageFile File object to upload to storage.
   * @returns the file path to retrieve from storage.
   */
  async function uploadImage(headerImageFile: File): Promise<string> {
    // TODO: 2022-10-03: Remove the iOS fallback in the future
    const fileName = uuidv4(); // crypto.randomUUID();
    const { data, error } = await supabase.storage
      .from("event-header-images")
      .upload(fileName, headerImageFile, {
        contentType: "image/png",
      });

    if (error) throw error;
    if (!data || !data.Key) {
      throw new Error("Received no data after uploading image");
    }
    // return file path
    return data.Key;
  }

  // INSERT
  async function createEvent(eventData: EditEventInfo): Promise<number> {
    console.log("Called useEventService.createEvent()", eventData);

    if (!authStore.user) {
      throw Error("Please log in first", {
        cause: new Error("User not logged in"),
      });
    }

    // the user has selected a new image header
    if (eventData.headerImageFile) {
      eventData.header_image = await uploadImage(eventData.headerImageFile);
    }

    let creationError: PostgrestError | null;
    let id: number;
    if (eventData.uses_groups) {
      if (!eventData.event_groups)
        throw Error(
          "Event is indicated to use groups, but no groups were provided"
        );
      const { error, data } = await supabase.rpc("create_event_with_groups", {
        title: eventData.title,
        description: eventData.description,
        header_image: eventData.header_image ?? null,
        datetime: eventData.datetime.toInstant().toString(),
        location: eventData.location,
        max_participants: eventData.max_participants,
        groupATitle: eventData.event_groups.groupA.title,
        groupADescription: eventData.event_groups.groupA.description,
        groupBTitle: eventData.event_groups.groupB.title,
        groupBDescription: eventData.event_groups.groupB.description,
      });
      if (error) throw error;

      // TODO: remove once we find a way to correctly type this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: supabase typing is wrong, this returns a number (the id)
      id = data as number;
    } else {
      const {
        title,
        description,
        header_image,
        datetime,
        location,
        max_participants,
      } = eventData;
      const { error, data } = await supabase.from("events").insert(
        {
          title,
          description,
          // TODO: remove once we find a way to correctly type this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: supabase typing is wrong, this column is nullable
          header_image,
          location,
          max_participants,
          organizer: authStore.user.id,
          datetime: datetime.toInstant().toString(),
          event_group_pair: undefined,
        },
        { returning: "representation" }
      );
      if (error) throw error;

      id = data[0].id;
    }

    return id;
  }

  // UPDATE
  // ...

  async function updateEvent(id: number, eventData: EditEventInfo) {
    const {
      title,
      description,
      headerImageFile,
      location,
      max_participants,
      datetime,
    } = eventData;

    // if user uploader a header image we upload it and
    // set the header_image path to the returned storage path
    // otherwise we keep the current one or set it null if it was deleted
    const header_image = headerImageFile
      ? await uploadImage(headerImageFile)
      : eventData.header_image ?? null;

    const { error } = await supabase
      .from("events")
      .update({
        title,
        description,
        // TODO: remove once we find a way to correctly type this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: supabase typing is wrong, this column is nullable
        header_image,
        location,
        max_participants,
        datetime: datetime.toInstant().toString(),
      })
      .match({ id });
    if (error) throw error;
  }

  // DELETE
  // ...

  async function registerForEvent(
    eventId: number,
    groupId?: number
  ): Promise<void> {
    if (!authStore.user?.id) throw new Error("User not logged in");

    const { error } = await supabase.from("event_registrations").insert({
      user_id: authStore.user.id,
      event_id: eventId,
      group_id: groupId,
    });

    if (error) throw error;
  }

  async function isRegisteredForEvent(eventId: number): Promise<boolean> {
    if (!authStore.user?.id) return false;

    const { error, count } = await supabase
      .from("event_registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("user_id", authStore.user?.id);

    if (error) throw error;
    return count != 0;
  }

  return {
    createEvent,
    updateEvent,
    fetchEvents,
    fetchEventById,
    fetchUserEvents,
    isRegisteredForEvent,
    registerForEvent,
    fetchOrganizerEvents,
    getPagination,
  };
}
