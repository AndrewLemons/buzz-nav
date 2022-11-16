import { ComplexMath } from "@buzz-nav/utilities";
import Layer from "./layer.js";

export default class Node {
	#id;
	#xPosition;
	#yPosition;
	#layer;
	#info;

	/**
	 * Create a new node.
	 * @param {number} id the ID of the node
	 * @param {number} xPosition the X position of the node
	 * @param {number} yPosition the Y position of the node
	 * @param {Layer} layer the layer of the node
	 * @param {string} info the info for the node
	 */
	constructor(id, xPosition, yPosition, layer, info) {
		this.#id = id;
		this.#xPosition = xPosition;
		this.#yPosition = yPosition;
		this.#layer = layer;
		this.#info = info;
	}

	/**
	 * Get the ID of the node.
	 * @returns {number} the ID of the node
	 */
	getId() {
		return this.#id;
	}

	/**
	 * Get the X position of the node.
	 * @returns {number} the X position of the node
	 */
	getXPosition() {
		return this.#xPosition;
	}

	/**
	 * Get the Y position of the node.
	 * @returns {number} the Y position of the node
	 */
	getYPosition() {
		return this.#yPosition;
	}

	/**
	 * Get the layer of the node.
	 * @returns {Layer} the layer of the node
	 */
	getLayer() {
		return this.#layer;
	}

	/**
	 * Get the information for the node.
	 * @returns {string} the information for the node
	 */
	getInfo() {
		return this.#info;
	}

	/**
	 * Get the distance between two nodes.
	 * @param {Node} otherNode the other node
	 * @returns {number} the distance between the two nodes
	 */
	getDistanceTo(otherNode) {
		if (this.getLayer().getId() === otherNode.getLayer().getId()) {
			if (this.getLayer().getId() === 1) {
				return ComplexMath.haversineDistance(
					this.getXPosition(),
					this.getYPosition(),
					otherNode.getXPosition(),
					otherNode.getYPosition()
				);
			}

			return ComplexMath.pythagoreanDistance(
				this.getXPosition(),
				this.getYPosition(),
				otherNode.getXPosition(),
				otherNode.getYPosition()
			);
		}

		if (this.getLayer().getId() === 1) {
			let offset = otherNode
				.getLayer()
				.getOffsetFrom(this.getYPosition(), this.getXPosition());
			offset.x += otherNode.getXPosition();
			offset.y += otherNode.getYPosition();
			let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
			return ComplexMath.pythagoreanDistance(
				distance,
				otherNode.getLayer().getZOffset() * 4,
				0,
				0
			);
		}

		if (otherNode.getLayer().getId() === 1) {
			let offset = this.getLayer().getOffsetFrom(
				otherNode.getYPosition(),
				otherNode.getXPosition()
			);
			offset.x += this.getXPosition();
			offset.y += this.getYPosition();
			let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
			return ComplexMath.pythagoreanDistance(
				distance,
				this.getLayer().getZOffset() * 4,
				0,
				0
			);
		}

		let offset = this.getLayer().getOffsetFrom(
			otherNode.getLayer().getYPosition(),
			otherNode.getLayer().getXPosition()
		);
		offset.x += this.getXPosition() - otherNode.getXPosition();
		offset.y += this.getYPosition() - otherNode.getYPosition();
		let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
		return ComplexMath.pythagoreanDistance(
			distance,
			this.getLayer().getZOffset() * 4,
			0,
			otherNode.getLayer().getZOffset() * 4
		);
	}

	/**
	 * Get the string representation of the node.
	 * @returns {string} the string representation of the node
	 */
	toString() {
		return `Node #${this.#id} @ (${this.#xPosition}, ${
			this.#yPosition
		}) ∈ ${JSON.stringify(this.#layer.getName())}`;
	}

	/**
	 * Get the object representation of the node.
	 * @returns {object} the object representation of the node
	 */
	toJSON() {
		return {
			id: this.#id,
			xPosition: this.#xPosition,
			yPosition: this.#yPosition,
			layer: this.#layer.toJSON(),
			info: this.#info,
		};
	}
}
