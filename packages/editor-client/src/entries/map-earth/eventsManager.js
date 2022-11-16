import * as Api from "../../js/api.js";

export default class EventsManager {
	#map;
	#mapManager;
	#selectedTool;

	constructor() {
		this.#selectedTool = sessionStorage.getItem("selectedTool") ?? "select";

		window.addEventListener("storage", (event) => {
			this.onStorageUpdate(event);
		});
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

	async onNodeClick(node) {
		this.#ensureSetup();

		if (this.#selectedTool === "select") {
			console.log("Selected", node);
		} else if (this.#selectedTool === "delete") {
			await Api.removeNode(node.id);
			this.#mapManager.removeNode(node);
		}
	}

	async onNodeDrag(node, latLng) {
		this.#ensureSetup();

		let newNode = await Api.updateNode(node.id, {
			xPosition: latLng.lng,
			yPosition: latLng.lat,
		});

		this.#mapManager.addNode(newNode);
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
		if (event.storageArea === window.sessionStorage) {
			if (event.key === "selectedTool") {
				this.#selectedTool = event.newValue;

				if (this.#selectedTool === "move") {
					this.#mapManager.enableNodeDragging();
				} else {
					this.#mapManager.disableNodeDragging();
				}
			}
		}
	}
}
