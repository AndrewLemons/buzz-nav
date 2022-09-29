export default class Layer {
	#id;
	#name;
	#algorithm;

	static ALGORITHMS = ["PYTHAGOREAN", "HAVERSINE"];

	/**
	 * @param {number} id
	 * @param {string} name
	 * @param {string} algorithm
	 */
	constructor(id, name, algorithm) {
		this.#id = id;
		this.#name = name;
		this.#algorithm = Layer.ALGORITHMS[algorithm] ?? Layer.ALGORITHMS[0];
	}

	getId() {
		return this.#id;
	}

	getName() {
		return this.#name;
	}

	getAlgorithm() {
		return this.#algorithm;
	}
}
