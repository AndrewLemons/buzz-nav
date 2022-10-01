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

		return this.#aNode.getDistanceTo(this.#bNode);
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
