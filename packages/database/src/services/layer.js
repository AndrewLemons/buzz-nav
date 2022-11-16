import { sql } from "@buzz-nav/utilities";
import Layer from "../models/layer.js";

export default class LayerService {
	#db;

	/**
	 * Create a new layer service.
	 * @param {*} database
	 */
	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

	/**
	 * Initialize the layer portion of the database.
	 * @private
	 */
	#initDatabase() {
		this.#db
			.prepare(
				sql`
					CREATE TABLE IF NOT EXISTS layer (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						name TEXT NOT NULL,
						xPosition REAL NOT NULL,
						yPosition REAL NOT NULL,
						zOffset INTEGER NOT NULL DEFAULT 0
					)
				`
			)
			.run();
		this.#db
			.prepare(
				sql`REPLACE INTO layer (id, name, xPosition, yPosition) VALUES (1, 'Default', 0, 0)`
			)
			.run();
	}

	/**
	 * Get all layers.
	 * @returns {Layer[]}
	 */
	getLayers() {
		return this.#db
			.prepare(sql`SELECT * FROM layer`)
			.all()
			.map(
				(row) =>
					new Layer(row.id, row.name, row.xPosition, row.yPosition, row.zOffset)
			);
	}

	/**
	 * Get a layer by its ID.
	 * @param {number} layerId the ID of the layer
	 * @returns {Layer} the layer
	 */
	getLayerById(layerId) {
		let result = this.#db
			.prepare(sql`SELECT * FROM layer WHERE id = ?`)
			.get(layerId);

		return new Layer(
			result.id,
			result.name,
			result.xPosition,
			result.yPosition,
			result.zOffset
		);
	}

	/**
	 * Create a new layer.
	 * @param {string} name the name of the layer
	 * @param {number} xPosition the X position of the layer
	 * @param {number} yPosition the Y position of the layer
	 * @param {number} zOffset the Z offset of the layer
	 * @returns {Layer} the created layer
	 */
	createLayer(name, xPosition, yPosition, zOffset) {
		let result = this.#db
			.prepare(
				sql`INSERT INTO layer (name, xPosition, yPosition, zOffset) VALUES (?, ?, ?, ?)`
			)
			.run(name, xPosition, yPosition, zOffset);

		return this.getLayerById(result.lastInsertRowid);
	}
}
