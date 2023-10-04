import { App } from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";

// import base components
import BaseModal from "@/components/base/BaseModal.vue";

export default {
  install(app: App) {

    // register base components
    app.component("base-modal", BaseModal);
  },
};
