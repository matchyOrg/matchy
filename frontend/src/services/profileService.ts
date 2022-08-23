import { useAuthStore } from '@/stores/auth';
import { supabase } from "./supabase";

export interface Profile {
  email?: string;
  fullName?: string;
  description?: string;
}

export function useProfileService() {
  const authStore = useAuthStore();

  // SELECT
  const readProfile = async () => {
    console.log("Called useProfileService.readProfile()");

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
    return retArg;
  };

  // UPDATE
  const updateProfile = async (newProfile: Profile) => {
    console.log("Called useProfileService.updateProfile()");

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
