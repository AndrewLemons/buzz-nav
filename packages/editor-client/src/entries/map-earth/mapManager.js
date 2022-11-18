import * as Api from "../../js/api.js";
import { Icons } from "../../js/leaflet.js";

export default class MapManager {
	#map;
	#eventsManager;
	#nodes;
	#paths;

	constructor() {
		this.#nodes = [];
		this.#paths = [];
	}

	setup(map, eventsManager) {
		this.#map = map;
		this.#eventsManager = eventsManager;

		this.#map.on("moveend", () => {
			this.updateElements();
		});

		this.updateElements();
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
			marker.on("dragend", () => {
				this.#eventsManager.onNodeDrag(node, marker.getLatLng());
			});
			this.#nodes.push({
				id: node.id,
				marker,
			});
		}
	}

	addPath(path) {
		this.#ensureSetup();

		let currentPath = this.#paths.find((p) => p.id === path.id);
		if (currentPath) {
			currentPath.polyline.setLatLngs([
				[path.aNode.yPosition, path.aNode.xPosition],
				[path.bNode.yPosition, path.bNode.xPosition],
			]);
		} else {
			let polyline = L.polyline(
				[
					[path.aNode.yPosition, path.aNode.xPosition],
					[path.bNode.yPosition, path.bNode.xPosition],
				],
				{
					color: "red",
				}
			);

			this.#paths.push({
				id: path.id,
				aNodeId: path.aNode.id,
				bNodeId: path.bNode.id,
				polyline,
			});

			polyline.addTo(this.#map);

			polyline.on("click", () => {
				this.#eventsManager.onPathClick(path);
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

	removePath(path) {
		this.#ensureSetup();

		let currentPath = this.#paths.find((p) => p.id === path.id);
		if (currentPath) {
			this.#map.removeLayer(currentPath.polyline);
			this.#paths = this.#paths.filter((p) => p.id !== currentPath.id);
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

	removeOutOfBoundsPaths() {
		this.#ensureSetup();

		const bounds = this.#map.getBounds();

		this.#paths.forEach((path) => {
			if (
				path.polyline.getLatLngs()[0].lat < bounds.getSouth() ||
				path.polyline.getLatLngs()[0].lat > bounds.getNorth() ||
				path.polyline.getLatLngs()[0].lng < bounds.getWest() ||
				path.polyline.getLatLngs()[0].lng > bounds.getEast() ||
				path.polyline.getLatLngs()[1].lat < bounds.getSouth() ||
				path.polyline.getLatLngs()[1].lat > bounds.getNorth() ||
				path.polyline.getLatLngs()[1].lng < bounds.getWest() ||
				path.polyline.getLatLngs()[1].lng > bounds.getEast()
			) {
				this.removePath(path);
			}
		});
	}

	async updateElements() {
		this.#ensureSetup();

		const bounds = this.#map.getBounds();
		let newElements = await Api.getMapByBoundingBox({
			layerId: 1,
			latA: bounds.getNorth(),
			lonA: bounds.getWest(),
			latB: bounds.getSouth(),
			lonB: bounds.getEast(),
		});

		this.removeOutOfBoundsNodes();
		this.removeOutOfBoundsPaths();

		newElements.nodes.forEach((n) => this.addNode(n));
		newElements.paths.forEach((p) => this.addPath(p));
	}

	updateNodePaths(node) {
		this.#ensureSetup();

		this.#paths.forEach((path) => {
			if (path.aNodeId === node.id) {
				path.polyline.setLatLngs([
					[node.yPosition, node.xPosition],
					path.polyline.getLatLngs()[1],
				]);
			} else if (path.bNodeId === node.id) {
				path.polyline.setLatLngs([
					path.polyline.getLatLngs()[0],
					[node.yPosition, node.xPosition],
				]);
			}
		});
	}

	enableNodeDragging() {
		this.#ensureSetup();

		this.#nodes.forEach((node) => {
			node.marker.dragging.enable();
		});
	}

	disableNodeDragging() {
		this.#ensureSetup();

		this.#nodes.forEach((node) => {
			node.marker.dragging.disable();
		});
	}
}
