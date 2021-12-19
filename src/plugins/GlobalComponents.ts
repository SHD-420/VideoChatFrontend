import { App } from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas,faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

// import base components
import BaseModal from "@/components/base/BaseModal.vue";

export default {
  install(app: App) {
    // register icons
    library.add(fas);
    library.add(faSignOutAlt);
    app.component("font-awesome-icon", FontAwesomeIcon);

    // register base components
    app.component("base-modal", BaseModal);
  },
};
