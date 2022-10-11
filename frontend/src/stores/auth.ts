import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { Provider, User } from "@supabase/supabase-js";
import { useProfileService, type Profile } from "@/services/profileService";
import { storageRef } from "./localstorage";

export const useAuthStore = defineStore("user", () => {
  // User
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);

  const redirect = storageRef("redirect");

  async function setUserStore(newUser: User | null) {
    console.log("Updating user state", newUser);
    user.value = newUser;
    if (newUser) {
      const fetchedProfile = await useProfileService().fetchProfile(newUser);
      setProfileStore(fetchedProfile);
    } else {
      setProfileStore({});
    }
  }

  // Profile
  const profile = ref<Profile>({});
  const isRegistered = computed(() => !!profile.value.fullName);

  function setProfileStore(newProfile: Profile) {
    console.log("Updating profile state", newProfile);
    profile.value = newProfile;
  }

  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth session changed", event, session);
    setUserStore(session?.user ?? null);
  });

  setUserStore(supabase.auth.user());

  async function signUp(email: string, password: string) {
    const redirectURL =
      new URL(import.meta.env.BASE_URL, window.location.origin) + "callback";
    redirect.value = "/edit-profile";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { error, user, session } = await supabase.auth.signUp(
      { email, password },
      { redirectTo: redirectURL }
    );

    if (error) throw error;
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
  }

  async function oAuthLogin(provider: Provider, afterLoginRedirect: string) {
    redirect.value = afterLoginRedirect;
    const redirectTo =
      new URL(import.meta.env.BASE_URL, window.location.origin) + "callback";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, session, error } = await supabase.auth.signIn(
      { provider: provider },
      { redirectTo }
    );
    if (error) throw error;
  }

  function logout() {
    supabase.auth.signOut(); // throws error
  }

  async function deleteAccount() {
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      errorToast(error);
      throw error;
    }
    // Weird quirk: we have to call this - otherwise the user is never updated.
    // But it will throw an error because the user does not exist anymore (because we deleted it).
    logout();
  }

  async function resetPassword(email: string) {
    const redirectTo =
      new URL(import.meta.env.BASE_URL, window.location.origin) +
      "reset-password";

    const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  }

  async function setNewPassword(password: string) {
    const { error } = await supabase.auth.update({ password });
    if (error) throw error;
  }

  return {
    user,
    isLoggedIn,
    setUserStore,
    profile: computed(() => profile.value),
    isRegistered,
    setProfileStore,
    login,
    oAuthLogin,
    logout,
    deleteAccount,
    redirect,
    signUp,
    resetPassword,
    setNewPassword,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
