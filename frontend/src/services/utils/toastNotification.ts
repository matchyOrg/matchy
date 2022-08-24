import type { HTTPError } from "ky";
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

export function errorToast(msg: string) {
  toast.error(msg, toastOptions);
}

export function useErrorHandler() {
  function isHttpError(e: any): e is HTTPError {
    return e?.name === "HTTPError";
  }

  async function getErrorMessage(e: any) {
    let message = "";
    if (isHttpError(e)) {
      message = await e.response.text();
    } else {
      message = e.message;
    }
    return message;
  }

  // handle error
  async function error(e: any) {
    console.error(e, { e });
    const message = await getErrorMessage(e);
    errorToast(message);
    return message;
  }

  return {
    getErrorMessage,
    error,
  };
}
