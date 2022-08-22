import { supabase } from "./supabase";
import type { useAuthStore } from "@/stores/auth";

export interface Profile {
  email?: string;
  fullName?: string;
  description?: string;
}

export function useProfileService(authStore: ReturnType<typeof useAuthStore>) {
  // SELECT
  const readProfile = async () => {
    if (!authStore.user) {
      throw Error("User is not logged in");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(`full_name, description, email`)
      .eq("user_id", authStore.user.id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("Fetching profile unsuccessful");
    }
    const retArg: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };

    // update store
    authStore.updateProfileStore(retArg);
    return retArg;
  };

  // UPDATE
  const updateProfile = async (newProfile: Profile) => {
    if (!authStore.user) {
      throw Error("User is not logged in");
    }
    if (!newProfile.fullName) {
      throw Error("Argument object is missing 'fullName' attribute");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: newProfile.fullName,
        description: newProfile.description,
      })
      .match({ user_id: authStore.user.id })
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw Error("Update of profile unsuccessful");
    }
    const retArg: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };

    // update store
    authStore.updateProfileStore(retArg);
    return retArg;
  };

  return {
    readProfile,
    updateProfile,
  };
}
