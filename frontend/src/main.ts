import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./styles/containers.css";
import "./styles/global.css";

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
app.use(vuetify);

app.mount("#app");
