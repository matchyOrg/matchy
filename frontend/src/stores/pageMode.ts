import { useStorage } from "@vueuse/core";

export type PageModes = "participant" | "organizer";

// current view
export const PageMode = useStorage<PageModes>("page-mode", "participant");

export function getNextPageMode(pageMode: PageModes) {
  if (pageMode === "participant") {
    return "organizer";
  } else {
    return "participant";
  }
}
