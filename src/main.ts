import { createApp } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "./router";
import store from "./store";
import App from "@/App.vue";

// import fonts
import "@/assets/styles/fonts.css";

// import icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

const app = createApp(App).use(store).use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
