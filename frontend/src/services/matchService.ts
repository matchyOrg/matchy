import type { useAuthStore } from "@/stores/auth";
import type { PostgrestError } from "@supabase/postgrest-js";
import type { Profile } from "./profileService";
import { supabase } from "./supabase";

export interface EventMatchesRaw {
  id: number;
  title: string;
  matches: [
    {
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
          "id, title, matches:event_registrations!inner(profile:profiles(fullName:full_name, email, description))"
        )
        // TODO: remove once we find a way to correctly type this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: valid because of joins
        .not("matches.profile.user_id", "eq", authStore.user.id)
        .order("datetime", { ascending: false });
    if (error) {
      throw error;
    }
    if (!data) throw new Error("No data returned");
    console.log(data);
    const eventMatches: EventMatches[] = data.map(
      ({ id, title, matches }: EventMatchesRaw) => {
        return {
          id,
          title,
          matches: matches
            .map(({ profile }) => profile) // profile nested in postgrest response
            .filter((p) => p !== null),
        };
      }
    );
    return eventMatches ?? [];
  }
  return {
    getMatches,
  };
}
