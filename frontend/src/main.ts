// external imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vant from "vant"; // OPTIMIZATION: import only chosen components

import "vant/lib/index.css";

// internal imports
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";

// global styling
import "./assets/base.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Vant);

app.mount("#app");
