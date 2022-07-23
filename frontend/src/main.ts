// external imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vant from "vant"; // OPTIMIZATION: import only necessary components

// internal imports
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";

// styling
import "./styles/colorPalette.css";
import "./styles/containers.css";
import "./styles/mobile.css";
import "./styles/whitespaces.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Vant);

app.mount("#app");
