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
			if (this.#aNode.getLayer().getAlgorithm() === "HAVERSINE") {
				return ComplexMath.haversineDistance(
					this.#aNode.getXPosition(),
					this.#aNode.getYPosition(),
					this.#bNode.getXPosition(),
					this.#bNode.getYPosition()
				);
			} else {
				return ComplexMath.pythagoreanDistance(
					this.#aNode.getXPosition(),
					this.#aNode.getYPosition(),
					this.#bNode.getXPosition(),
					this.#bNode.getYPosition()
				);
			}
		} else {
			console.warn(
				"Can not calculate path distance between two different layers"
			);
			return 0;
		}
	}

	getNodeA() {
		return this.#aNode;
	}

	getNodeB() {
		return this.#bNode;
	}

	toString() {
		return `Path #${
			this.#id
		}, ${this.#aNode.getId()} -> ${this.#bNode.getId()}`;
	}
}
