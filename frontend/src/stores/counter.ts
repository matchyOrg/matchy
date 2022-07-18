import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const counter = ref(0);
  const doubleCount = computed(() => counter.value * 2);
  const increment = () => counter.value++;

  return {
    doubleCount,
    increment,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
