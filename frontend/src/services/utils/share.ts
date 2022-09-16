import type { useAuthStore } from "@/stores/auth";
import type { useI18n } from "vue-i18n";
import type { EventInfo } from "../eventService";

export async function shareEvent(
  event: EventInfo,
  PageMode: string,
  authStore: ReturnType<typeof useAuthStore>,
  t: ReturnType<typeof useI18n>["t"]
) {
  let shareText;
  if (!authStore.isRegistered) {
    shareText = `Join the event "${event.title} on Matchy 🐱"`;
  } else if (
    PageMode === "organizer" &&
    event.organizer === authStore.user?.id
  ) {
    shareText = `${authStore.profile.fullName} invited you to their event "${event.title}"`;
  } else {
    shareText = `${authStore.profile.fullName} invited you to the event "${event.title}"`;
  }
  const shareData = {
    url: window.location.href,
    title: "Invitation to " + event.title,
    text: shareText,
  };
  try {
    if (typeof navigator?.share === "function") {
      await navigator.share(shareData);
    } else if (typeof navigator?.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        successToast(t("utils.share-event.copy-success"));
      } catch (_e) {
        errorToast(t("utils.share-event.clipboard-error"));
      }
    }
  } catch (_e) {
    errorToast(t("utils.share-event.share-error"));
  }
}
