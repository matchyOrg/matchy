import type { useAuthStore } from "@/stores/auth";
import type { EventInfo } from "../eventService";

export async function shareEvent(
  event: EventInfo,
  PageMode: string,
  authStore: ReturnType<typeof useAuthStore>
) {
  {
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
          successToast(
            "We couldn't share the event directly, but copied the link to your clipboard"
          );
        } catch (_e) {
          errorToast(
            "Oops, looks like we couldn't copy this link to your clipboard"
          );
        }
      }
    } catch (_e) {
      errorToast("Oops, looks like we can't share this link right now");
    }
  }
}
