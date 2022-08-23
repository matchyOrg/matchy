import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";
import router from "@/router";

export const useAuthStore = defineStore("user", () => {
  // user state (only update with setter)
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);

  // user setter
  async function setUserStore(newUser: User | null) {
    console.warn("Updating user state", newUser);
    user.value = newUser;
    if (newUser) {
      const fetchedProfile = await useProfileService().readProfile();
      setProfileStore(fetchedProfile);
    }
  }

  // user profile state (only update with setter)
  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);

  // profile setter
  async function setProfileStore(newProfile: Profile) {
    console.warn("Updating profile state", newProfile);
    profile.value = newProfile;
  }

  // on authState change, update everything
  // called when user clicked magic link!
  // see: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth session changed", event, session);
    setUserStore(session?.user ?? null);
    router.push("/");
  });

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
