import { ComplexMath } from "@buzz-nav/utilities";
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

	/**
	 * @param {Node} otherNode
	 * @returns {number}
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

	toString() {
		return `Node #${this.#id} @ (${this.#xPosition}, ${
			this.#yPosition
		}) ∈ ${JSON.stringify(this.#layer.getName())}`;
	}

	toJSON() {
		return {
			id: this.#id,
			xPosition: this.#xPosition,
			yPosition: this.#yPosition,
			layer: this.#layer.toJSON(),
		};
	}
}
