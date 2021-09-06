import { createApp } from "vue";
import router from "./router";
import store, { key } from "./store";
import App from "@/App.vue";

// import fonts
import "@/assets/styles/fonts.css";

// import global components
import GlobalComponents from "@/plugins/GlobalComponents";

const app = createApp(App).use(store, key).use(router);
app.use(GlobalComponents);
app.mount("#app");
