import { POSITION, useToast } from "vue-toastification";
const toast = useToast();

const toastOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
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

export async function errorToast(error: any) {
  console.error(error, { error });
  const message = await getErrorMessage(error);
  toast.error(error, toastOptions);
  return message;
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
