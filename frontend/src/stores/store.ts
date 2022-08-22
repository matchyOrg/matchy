/**
 * This component contains the necessary boilerplate and serves as a template / demo
 */

import { acceptHMRUpdate, defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  return {};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
