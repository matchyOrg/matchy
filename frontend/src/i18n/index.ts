import { createI18n } from "vue-i18n";
import en from "./en.json";
const translations = {
  en: en,
};

export const i18n = createI18n({
  legacy: false,
  locale: (navigator.language || "en").slice(0, 2),
  fallbackLocale: "en",
  messages: translations,
});
