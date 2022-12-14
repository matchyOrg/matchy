import { createApp } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore disable
import App from "./App.vue";
import router from "./router";
import "./polyfills";

import { createPinia } from "pinia";
const pinia = createPinia();

import Toast, { type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
const options: PluginOptions = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
};

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

import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#2e7d32",
          secondary: "#81c784",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  locale: createVueI18nAdapter({ i18n: i18n as any, useI18n }),
});

import "uno.css";

const app = createApp(App);
app.config.errorHandler = async (err, instance, info) => {
  console.error({
    err,
    instance,
    info,
  });
  const combinedError = new Error();
  combinedError.cause = err;
  combinedError.message = info;
  reportErrorToast(combinedError, "Unhandled error - click here to report it");
};

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(Toast, options);
app.use(vuetify);

app.mount("#app");
