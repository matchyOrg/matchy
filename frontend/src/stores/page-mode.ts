import { useStorage } from "@vueuse/core";

export type PageModes = "eventVisitor" | "eventOrganizer";
export const PageMode = useStorage<PageModes>("page-mode", "eventVisitor");
