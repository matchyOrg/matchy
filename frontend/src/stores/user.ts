/**
 * This store manages the applications state based on:
 * - "user": the users authentication data
 * - "profile": the users profile data
 */

import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

// TODO: HIGH PRIORITY: remove email from profile -> create getter function that reads it from "user"
interface Profile {
  email: string; // immediately derived from "User"
  username?: string; // required
  description?: string;
  avatar_url?: string;
}

const emptyProfile = (): Profile => {
  return {
    email: "",
    username: undefined,
    description: undefined,
    avatar_url: undefined,
  };
};

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);

  const profile = ref(emptyProfile());
  const isRegistered = computed(() => {
    return profile.value.username !== undefined;
  });

  // Clear profile when user changes
  watch(
    () => user.value,
    () => {
      profile.value = emptyProfile();
    }
  );

  const loadProfile = async () => {
    // Typescript doesn't have proper error handling
    if (!user.value || !user.value.email) throw new Error("User not loaded");

    // this will still end up logging a red line in the console
    const { data, error } = await supabase
      .from("profiles")
      .select(`username, description, avatar_url`)
      .eq("id", user.value.id)
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.username || !data.description || !data.avatar_url) {
      return false;
    }
    profile.value.email = user.value.email;
    profile.value.username = data.username;
    profile.value.description = data.description;
    profile.value.avatar_url = data.avatar_url;
    return true;
  };

  const updateProfile = async (data: Profile) => {
    if (!user.value || !user.value.email) throw new Error("User not loaded");
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.value.id,
        updated_at: new Date().toISOString(),
        username: data.username,
        description: data.description,
        avatar_url: data.avatar_url,
      },
      { returning: "minimal" } // Don't return the value after inserting
    );

    if (error) throw error;
  };

  const signOut = () => {
    user.value = null;
    // TODO: Clear profile
    supabase.auth.signOut();
  };

  return {
    user,
    isLoggedIn,
    profile,
    isRegistered,
    loadProfile,
    updateProfile,
    signOut,

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
