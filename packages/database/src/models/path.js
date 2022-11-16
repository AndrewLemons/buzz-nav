import Node from "./node.js";
import { ComplexMath } from "@buzz-nav/utilities";

export default class Path {
	#id;
	#length;
	#aNode;
	#bNode;

	/**
	 * Create a new path.
	 * @param {number} id the ID of the path
	 * @param {number} length the length of the path
	 * @param {Node} aNode the first node of the path
	 * @param {Node} bNode the second node of the path
	 */
	constructor(id, length, aNode, bNode) {
		this.#id = id;
		this.#length = length;
		this.#aNode = aNode;
		this.#bNode = bNode;
	}

	/**
	 * Get the ID of the path.
	 * @returns {number} the ID of the path
	 */
	getId() {
		return this.#id;
	}

	/**
	 * Get the length of the path.
	 * @returns {number} the length of the path
	 */
	getLength() {
		if (this.#length) {
			return this.#length;
		}

		return this.#aNode.getDistanceTo(this.#bNode);
	}

	/**
	 * Get the first node of the path.
	 * @returns {Node} the first node of the path
	 */
	getNodeA() {
		return this.#aNode;
	}

	/**
	 * Get the second node of the path.
	 * @returns {Node} the second node of the path
	 */
	getNodeB() {
		return this.#bNode;
	}

	/**
	 * Get the other node of the path.
	 * @param {Node} node the node to get the other node of
	 * @returns {Node} the other node of the path
	 */
	getOtherNode(node) {
		if (node.getId() === this.#aNode.getId()) {
			return this.#bNode;
		} else if (node.getId() === this.#bNode.getId()) {
			return this.#aNode;
		} else {
			throw new Error("Node is not part of this path");
		}
	}

	/**
	 * Get the string representation of the path.
	 * @returns {string} the string representation of the path
	 */
	toString() {
		return `Path #${
			this.#id
		}, ${this.#aNode.getId()} -> ${this.#bNode.getId()}`;
	}

	/**
	 * Get the object representation of the path.
	 * @returns {object} the object representation of the path
	 */
	toJSON() {
		return {
			id: this.#id,
			length: this.getLength(),
			aNode: this.#aNode.toJSON(),
			bNode: this.#bNode.toJSON(),
		};
	}
}
