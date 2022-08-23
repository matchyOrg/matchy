import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";

export const useAuthStore = defineStore("user", () => {
  // user state (only update with setter)
  const user = ref<User | null>(supabase.auth.user());
  const isLoggedIn = computed(() => user.value !== null);
  const setUserStore = async (newUser: User | null) => {
    console.log("Called useAuthStore.updateUserStore()", newUser);
    user.value = newUser;
  };

  // user profile state (only update with setter)
  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);
  const setProfileStore = async (newProfile: Profile) => {
    console.log("Called useAuthStore.updateProfileStore()", newProfile);
    profile.value = newProfile;
  };

  // on authState change, update everything
  // see: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth session changed", event, session);
    setUserStore(session?.user ?? null);
    const profileService = useProfileService();
    setProfileStore(await profileService.readProfile());
  });

  // on user change, update profile
  // watch(
  //   isLoggedIn,
  //   async (isLoggedIn) => {
  //     profile.value = {};
  //     if (isLoggedIn) {
  //       setProfileStore(await profileService.readProfile());
  //     }
  //   },
  //   { immediate: true }
  // );

  return {
    user,
    isLoggedIn,
    profile,
    isRegistered,
    setUserStore,
    setProfileStore,

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
