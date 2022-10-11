import type { User } from "@supabase/gotrue-js";
import { supabase } from "./supabase";

export interface Profile {
  email?: string;
  fullName?: string;
  description?: string;
}

export function useProfileService() {
  async function fetchProfile(user: User) {
    console.log("Called useProfileService.fetchProfile()");

    if (!user.email) {
      throw Error("User is not logged in");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(`full_name, description, email`)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("Fetching profile failed");
    }
    const retArg: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };
    return retArg;
  }

  async function updateProfile(user: User, newProfile: Profile) {
    console.log("Called useProfileService.updateProfile()", newProfile);

    if (!newProfile.fullName) {
      throw Error("Please register first");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: newProfile.fullName,
        description: newProfile.description,
      })
      .match({ user_id: user.id })
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw Error("Update of profile failed");
    }
    const updatedProfile: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };

    // update store
    return updatedProfile;
  }

  return {
    fetchProfile,
    updateProfile,
  };
}
