/**
 * On the insertion of every entry into the "user" table a trigger inserts an entry into the "profile" table
 * and copies the users ID and mail from the "user" table.
 *
 * Therefore the "profile" table inherits from the "user" table in the database:
 * - "user": Contains all of the users auth data (managed by supabase)
 * - "profile": Contains all of the users data (including the email and user ID from the "user" table)
 */

import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";

export const useAuthStore = defineStore("user", () => {
  // user state
  const user = ref<User | null>(supabase.auth.user());
  const isLoggedIn = computed(() => user.value !== null);

  // user profile state
  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);

  // authService session listener: update user and profile
  // see: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
  const profileService = useProfileService();
  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user ?? null;
    profile.value = await profileService.readProfile();
    console.log("Auth session changed on event:", event, session);
    console.log("Updated user and profile:", user.value, profile.value);
  });

  // user setter (only called by authService.login())
  // Setter functions are necessary to track the state
  const updateUserStore = async (newUser: User | null) => {
    console.log("Called useAuthStore.updateUserStore()");
    user.value = newUser;
  };

  // profile setter (only called by profileService.updateProfile())
  // Setter functions are necessary to track the state
  const updateProfileStore = async (newProfile: Profile) => {
    console.log("Called useAuthStore.updateProfileStore()");
    profile.value = newProfile;
  };

  return {
    user,
    isLoggedIn,
    profile,
    isRegistered,
    updateUserStore,
    updateProfileStore,

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
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
