import { useStorage } from "@vueuse/core";

export type PageModes = "participant" | "organizer";

// current view
export const PageMode = useStorage<PageModes>("page-mode", "participant");
