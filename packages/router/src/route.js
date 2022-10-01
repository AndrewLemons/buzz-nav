import { Path } from "@buzz-nav/database";

export default class Route {
	#paths;

	/**
	 * @param {Path[]} paths
	 */
	constructor(paths) {
		this.#paths = paths;
	}

	getPaths() {
		return this.#paths;
	}

	getNodes() {
		let firstNode = this.#paths[0].getNodeA();
		if (
			this.#paths[0].getNodeA().getId() === this.#paths[1].getNodeA().getId() ||
			this.#paths[0].getNodeA().getId() === this.#paths[1].getNodeB().getId()
		) {
			firstNode = this.#paths[0].getNodeB();
		}

		const nodes = [firstNode];
		for (const path of this.#paths) {
			nodes.push(path.getOtherNode(nodes[nodes.length - 1]));
		}
		return nodes;
	}

	getTotalLength() {
		let length = 0;
		for (const path of this.#paths) {
			length += path.getLength();
		}
		return length;
	}
}
