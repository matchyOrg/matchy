import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { Toast } from "vant";
import "./assets/main.css";

const app = createApp(App);
app.use(Toast);
app.use(createPinia());
app.use(router);

app.mount("#app");
