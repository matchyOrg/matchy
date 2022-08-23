import { createVuetify, type ThemeDefinition } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// fonts, icons
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// i18n
// (see: https://github.com/vuetifyjs/vuetify/blob/next/packages/vuetify/src/locale/adapters/vue-i18n.ts)
// import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
// import { use18n } from "vue-i18n";
import { i18n } from "./../i18n/index";
// TODO: the imports above throw errors, why?

export const vuetify = createVuetify({
  components,
  directives,

  // theme
  // see: https://next.vuetifyjs.com/en/features/theme/#setup
  // see: https://next.vuetifyjs.com/en/api/v-theme-provider/
  theme: {
    defaultTheme: "light", // light, dark, or custom
  },

  // fonts, icons
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },

  // i18n
  // locale: createVueI18nAdapter({ i18n, useI18n }),
});
