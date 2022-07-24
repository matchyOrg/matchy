import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

// TODO: Figure out if we want https://github.com/wobsoriano/pinia-shared-state

const emptyProfile = () => {
  return {
    username: "",
  };
};

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);

  const profile = ref(emptyProfile());

  // Clear profile when user changes
  watch(
    () => user.value,
    () => {
      profile.value = emptyProfile();
    }
  );

  // Typescript doesn't have proper error handling
  const loadProfile = async () => {
    if (!user.value) throw new Error("User not loaded");

    // Note that this will still end up logging a red line in the console
    const { data, error } = await supabase
      .from("profiles")
      .select(`username, website, avatar_url`)
      .eq("id", user.value.id)
      .maybeSingle();

    if (error) throw error;

    if (!data || !data.username) {
      // The profile can still be missing when the user has just registered
      return false;
    }

    profile.value.username = data.username;
    return true;
  };

  const updateProfile = async (data: { username: string }) => {
    if (!user.value) throw new Error("User not loaded");

    const { error } = await supabase.from("profiles").upsert(
      {
        ...data,
        id: user.value.id,
        updated_at: new Date().toISOString(),
      },
      {
        returning: "minimal", // Don't return the value after inserting
      }
    );

    if (error) throw error;
  };

  const signOut = () => {
    user.value = null;
    supabase.auth.signOut();
  };

  return {
    user,
    isLoggedIn,
    signOut,
    profile,
    loadProfile,
    updateProfile,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
