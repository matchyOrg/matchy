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
  // I'm not sure if surpressing toasts is what we want
  /*filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false;
    }
    return toast;
  },*/
};

// for integration with vuetify see: https://next.vuetifyjs.com/en/features/internationalization/
import { createI18n, useI18n } from "vue-i18n";
import en from "./locales/en.json";
import de from "./locales/de.json";
const i18n = createI18n({
  legacy: false,
  locale: (navigator.language || "en").slice(0, 2),
  fallbackLocale: "en",
  messages: {
    en,
    de,
  },
});

/**
 * Vuetify
 */
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
// TODO: Remove the ts-ignore once this gets fixed https://github.com/vuetifyjs/vuetify/issues/15699
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  locale: createVueI18nAdapter({ i18n, useI18n }),
});

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(i18n);
app.use(Toast, options);
app.use(vuetify);

app.mount("#app");
