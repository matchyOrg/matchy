import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";

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
  });

  async function login(email: string) {
    // TODO: Try out something like https://github.com/JMaylor/vuepabase/blob/5e5668af6b4430a0c6dc7f6b72b38f885de2d2de/src/components/AuthForm.vue#L42
    // (Make sure to handle Vue's hash mode correctly)
    const redirectTo = window.location.origin; // no idea if this is needed

    try {
      const { error } = await supabase.auth.signIn({ email }, { redirectTo });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      alert(error.error_description || error.message);
    }
  }

  // LOGOUT
  async function logout() {
    supabase.auth.signOut();
  }

  return {
    user,
    isLoggedIn,
    profile,
    isRegistered,
    setUserStore,
    setProfileStore,
    login,
    logout,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
