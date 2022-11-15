import * as Api from "../../js/api.js";
import { Icons } from "../../js/leaflet.js";

export default class MapManager {
	#map;
	#eventsManager;
	#nodes;

	constructor() {
		this.#nodes = [];
	}

	setup(map, eventsManager) {
		this.#map = map;
		this.#eventsManager = eventsManager;

		this.#map.on("moveend", () => {
			this.updateNodes();
		});

		this.updateNodes();
	}

	#ensureSetup() {
		if (!this.#map) {
			throw new Error("Map not set");
		}
		if (!this.#eventsManager) {
			throw new Error("Events manager not set");
		}
	}

	addNode(node) {
		this.#ensureSetup();

		let currentNode = this.#nodes.find((n) => n.id === node.id);

		if (currentNode) {
			currentNode.marker.setLatLng([node.yPosition, node.xPosition]);
		} else {
			let marker = L.marker([node.yPosition, node.xPosition], {
				icon: Icons.Node,
			});
			marker.addTo(this.#map);
			marker.on("click", () => {
				this.#eventsManager.onNodeClick(node);
			});
			this.#nodes.push({
				id: node.id,
				marker,
			});
		}
	}

	removeNode(node) {
		this.#ensureSetup();

		let currentNode = this.#nodes.find((n) => n.id === node.id);
		if (currentNode) {
			this.#map.removeLayer(currentNode.marker);
			this.#nodes = this.#nodes.filter((n) => n.id !== currentNode.id);
		}
	}

	removeOutOfBoundsNodes() {
		this.#ensureSetup();

		const bounds = this.#map.getBounds();

		this.#nodes.forEach((node) => {
			if (
				node.marker.getLatLng().lat < bounds.getSouth() ||
				node.marker.getLatLng().lat > bounds.getNorth() ||
				node.marker.getLatLng().lng < bounds.getWest() ||
				node.marker.getLatLng().lng > bounds.getEast()
			) {
				this.removeNode(node);
			}
		});
	}

	async updateNodes() {
		this.#ensureSetup();
		this.removeOutOfBoundsNodes();

		const bounds = this.#map.getBounds();
		let newNodes = await Api.getNodesByBoundingBox({
			layerId: 1,
			latA: bounds.getNorth(),
			lonA: bounds.getWest(),
			latB: bounds.getSouth(),
			lonB: bounds.getEast(),
		});

		newNodes.forEach((n) => this.addNode(n));
	}
}
