import { sql } from "@buzz-nav/utilities";
import Path from "../models/path.js";
import Node from "../models/node.js";
import Layer from "../models/layer.js";

export default class PathService {
	#db;

	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

	#initDatabase() {
		this.#db
			.prepare(
				sql`
					CREATE TABLE IF NOT EXISTS path (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						length REAL,
						aNodeId INTEGER NOT NULL,
						bNodeId INTEGER NOT NULL,
						FOREIGN KEY (aNodeId) REFERENCES node (id),
						FOREIGN KEY (bNodeId) REFERENCES node (id)
					)
				`
			)
			.run();
	}

	getPathById(pathId) {
		console.log(pathId);
		let result = this.#db
			.prepare(
				sql`
					WITH _pathNode AS (
						SELECT 
							node.id,
							node.xPosition,
							node.yPosition,
							layer.id AS layer_id,
							layer.algorithm AS layer_algorithm
						FROM node
						JOIN layer ON node.layerId = layer.id
					)

					SELECT 
						path.id,
						path.length,
						/* A node fields */
						_aNode.id AS path_aNode_id,
						_aNode.xPosition AS path_aNode_xPosition,
						_aNode.yPosition AS path_aNode_yPosition,
						/* A node layer fields */
						_aNode.layer_id AS path_aNode_layer_id,
						_aNode.layer_algorithm AS path_aNode_layer_algorithm,
						/* B node fields */
						_bNode.id AS path_bNode_id,
						_bNode.xPosition AS path_bNode_xPosition,
						_bNode.yPosition AS path_bNode_yPosition,
						/* A node layer fields */
						_bNode.layer_id AS path_bNode_layer_id,
						_bNode.layer_algorithm AS path_bNode_layer_algorithm
					FROM path
					JOIN _pathNode _aNode ON path.aNodeId = _aNode.id AND path.id = ?
					JOIN _pathNode _bNode ON path.bNodeId = _bNode.id AND path.id = ?
				`
			)
			.get(pathId, pathId);

		let aNode = new Node(
			result.path_aNode_id,
			result.path_aNode_xPosition,
			result.path_aNode_yPosition,
			new Layer(result.path_aNode_layer_id, result.path_aNode_layer_algorithm)
		);
		let bNode = new Node(
			result.path_bNode_id,
			result.path_bNode_xPosition,
			result.path_bNode_yPosition,
			new Layer(result.path_bNode_layer_id, result.bNode_layer_algorithm)
		);

		return new Path(result.id, result.length, aNode, bNode);
	}

	/**
	 * @param {Node} aNode
	 * @param {Node} bNode
	 * @param {number} length
	 */
	createPath(aNode, bNode, length) {
		let result = this.#db
			.prepare(
				sql`
					INSERT INTO path (aNodeId, bNodeId, length) VALUES (?, ?, ?)
				`
			)
			.run(aNode.getId(), bNode.getId(), length);

		return this.getPathById(result.lastInsertRowid);
	}
}
