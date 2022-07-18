import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { Toast } from "vant";

const app = createApp(App);
app.use(Toast);
app.use(createPinia());
app.use(router);

app.mount("#app");
