// external imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import { PiniaSharedState } from "pinia-shared-state";

// internal imports
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";
// styling
import "./styles/colorPalette.css";
import "./styles/containers.css";
import "./styles/mobile.css";
import "./styles/whitespaces.css";

// vant globals
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";
import { vuetify } from "@/plugins/vuetify";

// Pass the plugin to your application's pinia plugin
const pinia = createPinia();
pinia.use(
  PiniaSharedState({
    // If set to true, enabled for all stores
    enable: false,
    // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
    initialize: true,
    // Enforce a type. One of native, idb, localstorage or node. Defaults to native.
    type: "localstorage",
  })
);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vuetify);

app.mount("#app");
