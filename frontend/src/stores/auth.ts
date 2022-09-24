import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { Provider, User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";
import { useStorage } from "@vueuse/core";

export const useAuthStore = defineStore("user", () => {
  // user state (only update with setter)
  const user = ref<User | null>(supabase.auth.user());
  const isLoggedIn = computed(() => user.value !== null);

  const redirect = useStorage("redirect", "/");
  // user setter
  async function setUserStore(newUser: User | null) {
    console.log("Updating user state", newUser);
    user.value = newUser;
    if (newUser) {
      const fetchedProfile = await useProfileService().readProfile(newUser);
      setProfileStore(fetchedProfile);
    }
  }

  // user profile state (only update with setter)
  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);

  // profile setter
  function setProfileStore(newProfile: Profile) {
    console.warn("Updating profile state", newProfile);
    profile.value = newProfile;
  }

  // on authState change, update everything (called when user clicked magic link)
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth session changed", event, session);
    setUserStore(session?.user ?? null);
  });

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  // LOGIN
  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
  }

  async function oAuthLogin(provider: Provider, afterLoginRedirect: string) {
    redirect.value = afterLoginRedirect;
    const redirectTo =
      new URL(import.meta.env.BASE_URL, window.location.origin) + "#/callback";
    const { user, session, error } = await supabase.auth.signIn(
      {
        provider: provider,
      },
      { redirectTo }
    );
    if (error) throw error;
  }

  // LOGOUT
  function logout() {
    // TODO: Catch error
    supabase.auth.signOut();
  }

  async function deleteAccount() {
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      errorToast(error);
      throw error;
    }
    // we have to call this otherwise the user is never updated
    // but it throws an error because the user does not exist anymore 😂
    logout();
  }

  return {
    user,
    isLoggedIn,
    setUserStore,
    profile,
    isRegistered,
    setProfileStore,
    login,
    oAuthLogin,
    logout,
    deleteAccount,
    redirect,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
