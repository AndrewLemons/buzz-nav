import * as Api from "../../js/api.js";

export default class EventsManager {
	#map;
	#mapManager;
	#selectedTool;
	#selectedNode;

	constructor() {
		this.#selectedTool = sessionStorage.getItem("selectedTool") ?? "select";
		this.#selectedNode = null;

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
		} else if (this.#selectedTool === "add-path") {
			if (this.#selectedNode) {
				let path = await Api.createPath({
					aNodeId: this.#selectedNode.id,
					bNodeId: node.id,
					length: 1,
				});

				this.#mapManager.addPath(path);
				this.#selectedNode = null;
			} else {
				this.#selectedNode = node;
			}
		}
	}

	async onNodeDrag(node, latLng) {
		this.#ensureSetup();

		let newNode = await Api.updateNode(node.id, {
			xPosition: latLng.lng,
			yPosition: latLng.lat,
		});

		this.#mapManager.addNode(newNode);
		this.#mapManager.updateNodePaths(newNode);
	}

	async onPathClick(path) {
		this.#ensureSetup();

		if (this.#selectedTool === "select") {
			console.log("Selected", path);
		} else if (this.#selectedTool === "delete") {
			await Api.removePath(path.id);
			this.#mapManager.removePath(path);
		}
	}

	async onMapClick(event) {
		this.#ensureSetup();

		if (this.#selectedTool === "add-node") {
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
