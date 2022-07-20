import { acceptHMRUpdate, defineStore } from "pinia";
import type { User } from "@supabase/supabase-js";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  //const profile

  return {
    user,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
