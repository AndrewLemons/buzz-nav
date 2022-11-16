import { ComplexMath } from "@buzz-nav/utilities";

export default class Layer {
	#id;
	#name;
	#xPosition;
	#yPosition;
	#zOffset;

	/**
	 * Create a new layer.
	 * @param {number} id the id of the layer
	 * @param {string} name the name of the layer
	 * @param {number} xPosition the X position of the layer
	 * @param {number} yPosition the Y position of the layer
	 * @param {number} zOffset the Z offset of the layer
	 */
	constructor(id, name, xPosition, yPosition, zOffset) {
		this.#id = id;
		this.#name = name;
		this.#xPosition = xPosition;
		this.#yPosition = yPosition;
		this.#zOffset = zOffset;
	}

	/**
	 * Get the id of the layer.
	 * @returns {number} the id of the layer
	 */
	getId() {
		return this.#id;
	}

	/**
	 * Get the name of the layer.
	 * @returns {string} the name of the layer
	 */
	getName() {
		return this.#name;
	}

	/**
	 * Get the X position of the layer.
	 * @returns {number} the X position of the layer
	 */
	getXPosition() {
		return this.#xPosition;
	}

	/**
	 * Get the Y position of the layer.
	 * @returns {number} the Y position of the layer
	 */
	getYPosition() {
		return this.#yPosition;
	}

	/**
	 * Get the offset of the layer from a given position.
	 * @param {number} lat the latitude of the position
	 * @param {number} lon the longitude of the position
	 * @returns {number} the offset of the layer from the position
	 */
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

	/**
	 * Get the Z offset of the layer.
	 * @returns {number} the Z offset of the layer
	 */
	getZOffset() {
		return this.#zOffset;
	}

	/**
	 * Get the object representation of the layer.
	 * @returns {object} the object representation of the layer
	 */
	toJSON() {
		return {
			id: this.#id,
			name: this.#name,
			xPosition: this.#xPosition,
			yPosition: this.#yPosition,
			zOffset: this.#zOffset,
		};
	}
}
