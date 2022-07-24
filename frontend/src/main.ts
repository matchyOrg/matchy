// external imports
import { createApp } from "vue";
import { createPinia } from "pinia";

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

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
