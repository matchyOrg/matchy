import type { useAuthStore } from "@/stores/auth";
import type { useI18n } from "vue-i18n";
import type { EventInfo } from "../eventService";

export async function shareEvent(
  event: EventInfo,
  authStore: ReturnType<typeof useAuthStore>,
  t: ReturnType<typeof useI18n>["t"],
  router: ReturnType<typeof useRouter>
) {
  let shareText;

  if (!authStore.isRegistered) {
    shareText = `Join the event "${event.title} on Matchy 🌱!`;
  } else if (event.organizer === authStore.user?.id) {
    shareText = `${authStore.profile.fullName} invited you to their event "${event.title}"`;
  } else {
    shareText = `${authStore.profile.fullName} invited you to the event "${event.title}"`;
  }
  const url = router.resolve("/events/" + event.id).href;
  const shareData = {
    url: url,
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
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      // User aborted the share, usually by clicking somewhere else
    } else {
      errorToast(e, t("utils.share-event.share-error"));
    }
  }
}
