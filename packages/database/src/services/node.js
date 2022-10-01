import { ComplexMath, sql } from "@buzz-nav/utilities";
import Node from "../models/node.js";
import Layer from "../models/layer.js";

export default class NodeService {
	#db;

	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

	#initDatabase() {
		this.#db
			.prepare(
				sql`
					CREATE TABLE IF NOT EXISTS node (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						xPosition REAL NOT NULL,
						yPosition REAL NOT NULL,
						layerId INTEGER NOT NULL,
						FOREIGN KEY (layerId) REFERENCES layer (id)
					)
				`
			)
			.run();
	}

	getNodeById(nodeId) {
		let result = this.#db
			.prepare(
				sql`
					SELECT 
						node.*, layer.id AS layer_id,
						layer.name AS layer_name,
						layer.xPosition AS layer_xPosition,
						layer.yPosition AS layer_yPosition,
						layer.zOffset AS layer_zOffset
					FROM node JOIN layer ON layer.id = node.layerId AND node.id = ?
				`
			)
			.get(nodeId);

		return new Node(
			result.id,
			result.xPosition,
			result.yPosition,
			new Layer(
				result.layer_id,
				result.layer_name,
				result.layer_xPosition,
				result.layer_yPosition,
				result.layer_zOffset
			)
		);
	}

	/**
	 * @param {number} xPosition
	 * @param {number} yPosition
	 * @param {number} layerId
	 * @returns
	 */
	createNode(xPosition, yPosition, layerId) {
		let result = this.#db
			.prepare(
				sql`
					INSERT INTO node (xPosition, yPosition, layerId) VALUES (?, ?, ?)
				`
			)
			.run(xPosition, yPosition, layerId);

		return this.getNodeById(result.lastInsertRowid);
	}
}
