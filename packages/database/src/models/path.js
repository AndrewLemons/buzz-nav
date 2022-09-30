import Node from "./node.js";
import { ComplexMath } from "@buzz-nav/utilities";

export default class Path {
	#id;
	#length;
	#aNode;
	#bNode;

	/**
	 * @param {number} id
	 * @param {number} length
	 * @param {Node} aNode
	 * @param {Node} bNode
	 */
	constructor(id, length, aNode, bNode) {
		this.#id = id;
		this.#length = length;
		this.#aNode = aNode;
		this.#bNode = bNode;
	}

	getId() {
		return this.#id;
	}

	getLength() {
		if (this.#length) {
			return this.#length;
		}

		if (this.#aNode.getLayer().getId() === this.#bNode.getLayer().getId()) {
			if (this.#aNode.getLayer().getId() === 1) {
				return ComplexMath.haversineDistance(
					this.#aNode.getXPosition(),
					this.#aNode.getYPosition(),
					this.#bNode.getXPosition(),
					this.#bNode.getYPosition()
				);
			}

			return ComplexMath.pythagoreanDistance(
				this.#aNode.getXPosition(),
				this.#aNode.getYPosition(),
				this.#bNode.getXPosition(),
				this.#bNode.getYPosition()
			);
		}

		if (this.#aNode.getLayer().getId() === 1) {
			let offset = this.#bNode
				.getLayer()
				.getOffsetFrom(this.#aNode.getYPosition(), this.#aNode.getXPosition());
			offset.x += this.#bNode.getXPosition();
			offset.y += this.#bNode.getYPosition();
			let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
			return ComplexMath.pythagoreanDistance(distance, offset.z * 4, 0, 0);
		}

		if (this.#bNode.getLayer().getId() === 1) {
			let offset = this.#aNode
				.getLayer()
				.getOffsetFrom(this.#bNode.getYPosition(), this.#bNode.getXPosition());
			offset.x += this.#aNode.getXPosition();
			offset.y += this.#aNode.getYPosition();
			let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
			return ComplexMath.pythagoreanDistance(distance, offset.z * 4);
		}

		let offset = this.#aNode
			.getLayer()
			.getOffsetFrom(
				this.#bNode.getLayer().getYPosition(),
				this.#bNode.getLayer().getXPosition()
			);
		offset.x += this.#aNode.getXPosition() - this.#bNode.getXPosition();
		offset.y += this.#aNode.getYPosition() - this.#bNode.getYPosition();
		let distance = ComplexMath.pythagoreanDistance(offset.x, offset.y, 0, 0);
		return ComplexMath.pythagoreanDistance(
			distance,
			this.#aNode.getLayer().getZOffset() * 4,
			0,
			this.#bNode.getLayer().getZOffset() * 4
		);
	}

	getNodeA() {
		return this.#aNode;
	}

	getNodeB() {
		return this.#bNode;
	}

	getOtherNode(node) {
		if (node.getId() === this.#aNode.getId()) {
			return this.#bNode;
		} else if (node.getId() === this.#bNode.getId()) {
			return this.#aNode;
		} else {
			throw new Error("Node is not part of this path");
		}
	}

	toString() {
		return `Path #${
			this.#id
		}, ${this.#aNode.getId()} -> ${this.#bNode.getId()}`;
	}
}
