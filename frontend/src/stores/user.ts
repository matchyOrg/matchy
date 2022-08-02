/**
 * This store manages the applications state based on:
 * - "user": the users authentication data
 * - "profile": the users profile data
 */

import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  email?: string; // derived from "user"
  username?: string;
  description?: string;
  avatar_url?: string;
}

export const useUserStore = defineStore("user", () => {
  const emptyProfile = (): Profile => {
    return {
      email: undefined,
      username: undefined,
      description: undefined,
      avatar_url: undefined,
    };
  };

  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);

  const profile = ref<Profile>(emptyProfile()); // is based on "user" (see: App.vue)
  const isRegistered = computed(() => !!profile.value.username); // check required attributes

  const clearProfile = () => {
    profile.value = emptyProfile();
  };

  /**
   * CRUD OPERATIONS
   */
  const createEmptyProfile = async () => {
    if (!user.value || !user.value.email) throw new Error("User not loaded");

    console.log("Creating profile");
    const { error } = await supabase.from("profiles").insert({
      id: user.value.id,
      updated_at: new Date().toISOString(),
      username: undefined,
      description: undefined,
      avatar_url: undefined,
    });
    if (error) throw error;
  };

  let firstAttempt = true;
  const fetchProfile = async () => {
    // Typescript doesn't have proper error handling
    if (!user.value || !user.value.email) throw new Error("User not loaded");
    console.log("Fetching profile with email:", user.value.email);

    // this will still end up logging a red line in the console
    const { data, error } = await supabase
      .from("profiles")
      .select(`username, description, avatar_url`)
      .eq("id", user.value.id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    console.log("Fetched:", data);
    if (!data && firstAttempt) {
      console.log("Profile does not exist in database");
      firstAttempt = false;
      createEmptyProfile();
      console.log("Starting to fetch a second time");
      fetchProfile();
    }
    if (!data) {
      console.error("Fetching profile failed after a second attempt");
      return false;
    }

    const completeData = {
      email: user.value.email,
      username: data.username,
      description: data.description,
      avatar_url: data.avatar_url,
    };
    profile.value = completeData;
    return true;
  };

  const updateProfile = async (data: Profile) => {
    if (!user.value || !user.value.email) throw new Error("User not loaded");
    const { error } = await supabase
      .from("profiles")
      .update(
        {
          updated_at: new Date().toISOString(),
          username: data.username,
          description: data.description,
          avatar_url: data.avatar_url,
        },
        { returning: "minimal" } // Don't return the value after inserting
      )
      .match({ id: user.value.id });

    if (error) throw error;
  };

  return {
    emptyProfile,
    user,
    isLoggedIn,
    profile,
    isRegistered,
    clearProfile,
    fetchProfile,
    updateProfile,

    // TODO: Wrong API usage (relevant issue https://github.com/wobsoriano/pinia-shared-state/issues/14)
    // share with other tabs via pinia-shared-state:
    // - see: https://github.com/wobsoriano/pinia-shared-state
    // - see: https://www.npmjs.com/package/pinia-shared-state
    share: {
      enable: true,
    },
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
