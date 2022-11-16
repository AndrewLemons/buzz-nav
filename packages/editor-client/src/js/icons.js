import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
	faArrowsUpDownLeftRight,
	faPlus,
	faTrash,
	faArrowPointer,
} from "@fortawesome/free-solid-svg-icons";

library.add(faArrowsUpDownLeftRight, faPlus, faTrash, faArrowPointer);

export { library, FontAwesomeIcon as Icon };
