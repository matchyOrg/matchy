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

export function defaultToast(msg: string) {
  toast(msg, toastOptions);
}

export function successToast(msg: string) {
  toast.success(msg, toastOptions);
}

export function infoToast(msg: string) {
  toast.info(msg);
}

export function warningToast(msg: string) {
  toast.warning(msg);
}

export function errorToast(msg: string) {
  toast.error(msg);
}
