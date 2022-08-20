/**
 * This store manages the applications state based on:
 * - "user": the users authentication data
 * - "profile": the users profile data
 */

import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  email?: string; // derived from "user"
  fullName?: string;
  description?: string;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(supabase.auth.user());
  const isLoggedIn = computed(() => user.value !== null);

  const profile = ref<Profile>({}); // is based on "user" (see: App.vue)
  const isRegistered = computed(() => !!profile.value.fullName); // check required attributes

  async function login(email: string) {
    console.log(window.location.href);
    const result = await supabase.auth.signIn(
      { email },
      { redirectTo: "http://127.0.0.1:5173" }
    );
    user.value = result.user;
    return result;
  }

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null;
  });

  const fetchProfile = async () => {
    // Typescript doesn't have proper error handling
    if (!user.value) throw new Error("user.ts: User not loaded");
    console.log("user.ts: Fetching profile with email:", user.value.email);

    // this will still end up logging a red line in the console
    const { data, error } = await supabase
      .from("profiles")
      .select(`full_name, description, email`)
      .eq("user_id", user.value.id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    console.log("user.ts: Fetched:", data);

    if (!data) {
      throw new Error("Fetching profile failed.");
    }

    const completeData = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };
    profile.value = completeData;
  };

  const updateProfile = async (data: Profile) => {
    if (!user.value || !user.value.email) throw new Error("User not loaded");
    const { error } = await supabase
      .from("profiles")
      .update(
        {
          full_name: data.fullName,
          description: data.description,
        },
        { returning: "minimal" } // Don't return the value after inserting
      )
      .match({ user_id: user.value.id });

    if (error) throw error;
  };

  watch(
    isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        profile.value = {};

        // TODO: That function is async, so there would be a theoretical bug when very quickly logging in and logging out.
        fetchProfile();
      } else {
        profile.value = {};
      }
    },
    { immediate: true }
  );

  return {
    user,
    login,
    isLoggedIn,
    profile,
    isRegistered,
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
