import { acceptHMRUpdate, defineStore } from "pinia";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

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

  // Ugh Typescript doesn't have proper error handling
  const loadProfile = async () => {
    if (!user.value) throw new Error("User not loaded");

    const { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website, avatar_url`)
      .eq("id", user.value.id)
      .single();

    if (error && status !== 406) throw error;

    if (!data || !data.username) throw new Error("Missing profile");

    profile.value.username = data.username;
    return true;
  };

  const updateProfile = async (data: { username: string }) => {
    const { error } = await supabase.from("profiles").upsert(
      {
        ...data,
        updated_at: new Date().toISOString(),
      },
      {
        returning: "minimal", // Don't return the value after inserting
      }
    );

    if (error) throw error;
  };

  return {
    user,
    isLoggedIn,
    profile,
    loadProfile,
    updateProfile,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
