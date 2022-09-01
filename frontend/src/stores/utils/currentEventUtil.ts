import { supabase } from "@/services/supabase";
import type { useAuthStore } from "../auth";

export async function isValidCurrentEvent(
  id: number,
  pagemode: string,
  authStore: ReturnType<typeof useAuthStore>
): Promise<boolean> {
  if (!authStore.user)
    throw new Error("Must be logged in to set current event");

  let query;
  if (pagemode === "organizer") {
    query = supabase
      .from("events")
      .select("id", { head: true, count: "exact" })
      .eq("organizer", authStore.user.id)
      .eq("id", id)
      .not("is_ended", "eq", true)
      .not("is_cancelled", "eq", true);
  } else {
    // user's registration to the event
    query = supabase
      .from("event_registrations")
      .select("id, events(is_ended, is_cancelled)", {
        head: true,
        count: "exact",
      })
      .eq("user_id", authStore.user.id)
      .eq("event_id", id)
      // TODO: find way to correctly type this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: valid because of foreign key
      .not("events.is_ended", "eq", true)
      // TODO: find way to correctly type this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: valid because of foreign key
      .not("events.is_cancelled", "eq", true);
  }
  const { error, count } = await query;
  if (error) throw error;
  return count === 1;
}
