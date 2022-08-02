import { useStorage } from "@vueuse/core";

// every user is a visitor and organizer at the same time and can access different views in the frontend
export type PageModes = "eventVisitor" | "eventOrganizer";
export const PageMode = useStorage<PageModes>("page-mode", "eventVisitor");
