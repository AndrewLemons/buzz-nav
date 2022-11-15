import * as Api from "../../js/api.js";

export default class EventsManager {
	#map;
	#mapManager;
	#selectedTool;

	constructor() {
		this.#selectedTool = sessionStorage.getItem("selectedTool") ?? "select";
	}

	setup(map, mapManager) {
		this.#map = map;
		this.#mapManager = mapManager;

		this.#map.on("click", (event) => {
			this.onMapClick(event);
		});
	}

	#ensureSetup() {
		if (!this.#map) {
			throw new Error("Map not set");
		}
		if (!this.#mapManager) {
			throw new Error("Map manager not set");
		}
	}

	onNodeClick(map, node) {
		this.#ensureSetup();

		if (this.#selectedTool === "select") {
			console.log("Selected", node);
		} else if (this.#selectedTool === "delete") {
			Api.removeNode(node.id);
		}
	}

	async onMapClick(event) {
		this.#ensureSetup();

		if (this.#selectedTool === "add") {
			let node = await Api.createNode({
				xPosition: event.latlng.lng,
				yPosition: event.latlng.lat,
				layerId: 1,
			});

			this.#mapManager.addNode(node);
		}
	}

	onStorageUpdate(event) {
		this.#ensureSetup();

		if (event.storageArea === window.sessionStorage) {
			if (event.key === "selectedTool") {
				this.#selectedTool = event.newValue;
			}
		}
	}
}
