// for integration with vuetify see: https://next.vuetifyjs.com/en/features/internationalization/
import { createI18n } from "vue-i18n";

const translations = {
  // ENGLISH
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: "Items per page:",
        pageText: "{0}-{1} of {2}",
      },
    },
  },

  // DEUTSCH
  de: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: "Elemente per Seite:",
        pageText: "{0}-{1} {2}",
      },
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: (navigator.language || "en").slice(0, 2),
  fallbackLocale: "en",
  messages: translations,
});
