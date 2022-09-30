import { ComplexMath } from "@buzz-nav/utilities";

export default class Layer {
	#id;
	#name;
	#xPosition;
	#yPosition;
	#zOffset;

	/**
	 * @param {number} id
	 * @param {string} name
	 * @param {number} xPosition
	 * @param {number} yPosition
	 * @param {number} zOffset
	 */
	constructor(id, name, xPosition, yPosition, zOffset) {
		this.#id = id;
		this.#name = name;
		this.#xPosition = xPosition;
		this.#yPosition = yPosition;
		this.#zOffset = zOffset;
	}

	getId() {
		return this.#id;
	}

	getName() {
		return this.#name;
	}

	getXPosition() {
		return this.#xPosition;
	}

	getYPosition() {
		return this.#yPosition;
	}

	getOffsetFrom(lat, lon) {
		let yOffset = ComplexMath.haversineDistance(this.#yPosition, lon, lat, lon);
		let xOffset = ComplexMath.haversineDistance(lat, this.#xPosition, lat, lon);

		yOffset = this.#yPosition < lat ? -yOffset : yOffset;
		xOffset = this.#xPosition < lon ? -xOffset : xOffset;

		return {
			x: xOffset,
			y: yOffset,
		};
	}

	getZOffset() {
		return this.#zOffset;
	}
}
