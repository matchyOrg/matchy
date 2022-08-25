import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./styles/global.css";

/**
 * Pinia
 */
import { createPinia } from "pinia";
const pinia = createPinia();

/**
 * Toastification
 */
import Toast, { type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
const options: PluginOptions = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false;
    }
    return toast;
  },
};

/**
 * Vuetify
 */
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
// (see: https://github.com/vuetifyjs/vuetify/blob/next/packages/vuetify/src/locale/adapters/vue-i18n.ts)
// import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
// import { use18n } from "vue-i18n";
// import { i18n } from "@/i18n/index";
// TODO: the imports above throw annoying errors although they should work in theory

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },

  // locale: createVueI18nAdapter({ i18n, useI18n }),
});

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Toast, options);
app.use(vuetify);

app.mount("#app");
