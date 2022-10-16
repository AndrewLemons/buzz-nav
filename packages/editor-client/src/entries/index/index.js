import { createApp } from "vue";
import { library, Icon } from "../../js/icons.js";

import App from "./App.vue";
import "../../styles/main.css";

createApp(App).use(library).component("Icon", Icon).mount("body");
