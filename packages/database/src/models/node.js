import Layer from "./layer.js";

export default class Node {
	#id;
	#xPosition;
	#yPosition;
	#layer;

	/**
	 * @param {number} id
	 * @param {number} xPosition
	 * @param {number} yPosition
	 * @param {Layer} layer
	 */
	constructor(id, xPosition, yPosition, layer) {
		this.#id = id;
		this.#xPosition = xPosition;
		this.#yPosition = yPosition;
		this.#layer = layer;
	}

	getId() {
		return this.#id;
	}

	getXPosition() {
		return this.#xPosition;
	}

	getYPosition() {
		return this.#yPosition;
	}

	getLayer() {
		return this.#layer;
	}

	toString() {
		return `Node #${this.#id} @ (${this.#xPosition}, ${
			this.#yPosition
		}) ∈ ${JSON.stringify(this.#layer.getName())}`;
	}
}
