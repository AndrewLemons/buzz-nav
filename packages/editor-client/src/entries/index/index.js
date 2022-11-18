import { createApp } from "vue";
import { library, Icon } from "../../js/icons.js";

import App from "./App.vue";
import Store from "./store.js";
import "../../styles/main.css";

// Reset session storage
sessionStorage.setItem("selectedTool", "select");
sessionStorage.setItem(
	"selectedElement",
	JSON.stringify({ type: "none", id: null })
);

createApp(App).use(library).use(Store).component("Icon", Icon).mount("body");
