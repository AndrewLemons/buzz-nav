import { sql } from "@buzz-nav/utilities";
import Layer from "../models/layer.js";

export default class LayerService {
	#db;

	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

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
	 * @param {number} layerId
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
	 * @param {string} name
	 * @param {number} xPosition - Longitude
	 * @param {number} yPosition - Latitude
	 * @param {number} zOffset
	 * @returns {Layer}
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
