import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { i18n } from "./i18n";

import "./styles/colorPalette.css";
import "./styles/containers.css";
import "./styles/global.css";
import "./styles/whitespaces.css";

// vant
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

// vuetify
import { vuetify } from "@/plugins/vuetify";

// pinia
import { createPinia } from "pinia";
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vuetify);

app.mount("#app");
