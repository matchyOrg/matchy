import { acceptHMRUpdate, defineStore } from "pinia";

/**
 * For stuff that doesn't belong in any other stores
 */
export const useStore = defineStore("store", () => {
  return {};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
