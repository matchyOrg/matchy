/**
 * This component contains things that doesn't belong in any other stores
 */

import { acceptHMRUpdate, defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  return {};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
