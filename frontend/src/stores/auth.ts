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
  const user = ref<User | null>(supabase.auth.user());
  const isLoggedIn = computed(() => user.value !== null);

  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);

  // auth listener: update user
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null;
  });

  // auth listener: update profile
  const profileService = useProfileService(useAuthStore());
  watch(
    isLoggedIn,
    async (isLoggedIn) => {
      if (isLoggedIn) {
        // service also updates the store
        await profileService.readProfile();
      } else {
        profile.value = {};
      }
    },
    { immediate: true }
  );

  // update profile - only called by profileService
  const updateProfileStore = async (newProfile: Profile) => {
    profile.value = newProfile;
  };

  return {
    user,
    isLoggedIn,
    profile,
    isRegistered,
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
