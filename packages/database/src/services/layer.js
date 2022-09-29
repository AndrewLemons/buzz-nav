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
						algorithm INTEGER NOT NULL
					)
				`
			)
			.run();
		this.#db
			.prepare(
				sql`REPLACE INTO layer (id, name, algorithm) VALUES (1, 'Default', 1)`
			)
			.run();
	}

	getLayers() {
		return this.#db
			.prepare(sql`SELECT * FROM layer`)
			.all()
			.map((row) => new Layer(row.id, row.name, row.algorithm));
	}

	/**
	 * @param {number} layerId
	 */
	getLayerById(layerId) {
		let result = this.#db
			.prepare(sql`SELECT * FROM layer WHERE id = ?`)
			.get(layerId);

		return new Layer(result.id, result.name, result.algorithm);
	}

	createLayer(name, algorithm) {
		let result = this.#db
			.prepare(sql`INSERT INTO layer (name, algorithm) VALUES (?, ?)`)
			.run(name, Math.max(Layer.ALGORITHMS.indexOf(algorithm), 0));

		return this.getLayerById(result.lastInsertRowid);
	}
}
