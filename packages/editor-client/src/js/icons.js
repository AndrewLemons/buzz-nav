import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
	faArrowsUpDownLeftRight,
	faPlus,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

library.add(faArrowsUpDownLeftRight, faPlus, faTrash);

export { library, FontAwesomeIcon as Icon };
