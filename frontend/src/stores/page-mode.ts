import { useStorage } from "@vueuse/core";

export type PageModes = "user" | "organizer";
export const PageMode = useStorage<PageModes>("page-mode", "user");
