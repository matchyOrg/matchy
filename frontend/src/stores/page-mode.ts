import { useStorage } from "@vueuse/core";

// current view
export type PageModes = "participant" | "organizer";
export const PageMode = useStorage<PageModes>("page-mode", "participant");
