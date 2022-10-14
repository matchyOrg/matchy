import { POSITION, useToast } from "vue-toastification";
import newGithubIssueUrl from "new-github-issue-url";
import { serializeError } from "serialize-error";
const toast = useToast();

const toastOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.3,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  icon: true,
  rtl: false,
};

export function successToast(msg: string) {
  toast.success(msg, toastOptions);
}

export function infoToast(msg: string) {
  toast.info(msg, toastOptions);
}

export function warningToast(msg: string) {
  toast.warning(msg, toastOptions);
}

export async function errorToast(error: any, userFriendlyMessage?: string) {
  console.error(error, { error, userFriendlyMessage });
  const message = await getErrorMessage(error);
  toast.error(
    (userFriendlyMessage ? userFriendlyMessage + "\n" : "") + message,
    toastOptions
  );
  return message;
}

export async function reportErrorToast(
  error: any,
  userFriendlyMessage?: string
) {
  console.error(error, { error, userFriendlyMessage });
  const message = await getErrorMessage(error);
  toast.error(
    (userFriendlyMessage ? userFriendlyMessage + "\n" : "") + message,
    {
      ...toastOptions,
      timeout: false,
      closeOnClick: false,
      onClick: () => {
        const errorString = escapeMarkdownCodeblock(
          JSON.stringify(serializeError(error), undefined, 0)
        );

        if (typeof navigator?.clipboard.writeText === "function") {
          navigator.clipboard.writeText(errorString).then(
            () => {
              const url = newGithubIssueUrl({
                user: "matchyOrg",
                repo: "matchy",
                title: "Error report: " + message,
                body:
                  "Please paste the error here. It has been copied to your clipboard.\n\n" +
                  "Please describe what you were doing when this error occurred and how to reproduce it.",
              });
              openInNewTab(url);
            },
            () => {
              // Not sure what to do
            }
          );
        } else {
          // Hmm
        }
      },
    }
  );
  return message;
}

function escapeMarkdownCodeblock(str: string) {
  const longestRunOfBackticks = (str.match(/`+/g) ?? [])
    .map((v) => v.length)
    .reduce((a, b) => (a > b ? a : b), 0);
  const escapeBackticks =
    "`".repeat(Math.max(3, longestRunOfBackticks + 1)) + str;
  return escapeBackticks + "\n" + str + "\n" + escapeBackticks;
}

// https://stackoverflow.com/a/28374344/3492994
function openInNewTab(href: string) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    rel: "noopener noreferrer",
    href: href,
  }).click();
}

async function getErrorMessage(e: any) {
  let message = "";
  if (typeof e === "string") {
    message = e;
  } else if ("message" in e) {
    message = e.message;
  } else if ("error" in e) {
    message = e.error;
  } else {
    message = "Unknown error";
  }
  return message;
}
