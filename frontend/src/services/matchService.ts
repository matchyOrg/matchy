import type { useAuthStore } from "@/stores/auth";
import type { PostgrestError } from "@supabase/postgrest-js";
import type { Profile } from "./profileService";
import { supabase } from "./supabase";

export interface EventMatchesRaw {
  id: number;
  title: string;
  resultsPublished: boolean;
  matches: [
    {
      uid: string;
      present: boolean;
      profile: Profile;
    }
  ];
}

export type EventMatches = Omit<EventMatchesRaw, "matches"> & {
  matches: Profile[];
};

export function useMatchService(authStore: ReturnType<typeof useAuthStore>) {
  async function getMatches(): Promise<EventMatches[]> {
    if (!authStore.user) return [];
    // TODO: remove once we find a way to correctly type this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: valid because of joins
    const {
      data,
      error,
    }: { data: EventMatchesRaw[] | null; error: PostgrestError | null } =
      await supabase
        .from("events")
        .select(
          "id, title, resultsPublished:results_published, matches:event_registrations!inner(present, uid:user_id, profile:profiles(fullName:full_name, email, description))"
        )
        .order("datetime", { ascending: false });
    if (error) {
      throw error;
    }
    if (!data) throw new Error("No data returned");
    console.log(data);
    const eventMatches: EventMatches[] = data
      // filter out events where the user wasn't present
      .filter(({ matches }) =>
        matches.some(({ uid, present }) =>
          uid === authStore.user?.id ? present : true
        )
      )
      .map(({ id, title, matches, resultsPublished }: EventMatchesRaw) => {
        return {
          id,
          title,
          resultsPublished,
          matches: matches
            .filter(({ uid }) => uid !== authStore.user?.id) // filter user's profile
            .map(({ profile }) => profile) // profile nested in postgrest response
            .filter((p) => p !== null),
        };
      });
    return eventMatches ?? [];
  }
  return {
    getMatches,
  };
}
