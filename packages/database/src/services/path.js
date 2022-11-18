import { sql } from "@buzz-nav/utilities";

import Path from "../models/path.js";
import Node from "../models/node.js";
import Layer from "../models/layer.js";

export default class PathService {
	#db;

	/**
	 * Create a new path service.
	 * @param {*} database
	 */
	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

	/**
	 * Initialize the path portion of the database.
	 * @private
	 */
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

	/**
	 * Get a path by its ID.
	 * @param {number} pathId the ID of the path to get
	 * @returns {Path} the path
	 */
	getPathById(pathId) {
		let result = this.#db
			.prepare(
				sql`
					WITH _pathNode AS (
						SELECT 
							node.id,
							node.xPosition,
							node.yPosition,
							layer.id AS layer_id,
							layer.name AS layer_name,
							layer.xPosition AS layer_xPosition,
							layer.yPosition AS layer_yPosition,
							layer.zOffset AS layer_zOffset
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
						_aNode.layer_name AS path_aNode_layer_name,
						_aNode.layer_xPosition AS path_aNode_layer_xPosition,
						_aNode.layer_yPosition AS path_aNode_layer_yPosition,
						_aNode.layer_zOffset AS path_aNode_layer_zOffset,
						/* B node fields */
						_bNode.id AS path_bNode_id,
						_bNode.xPosition AS path_bNode_xPosition,
						_bNode.yPosition AS path_bNode_yPosition,
						/* B node layer fields */
						_bNode.layer_id AS path_bNode_layer_id,
						_bNode.layer_name AS path_bNode_layer_name,
						_bNode.layer_xPosition AS path_bNode_layer_xPosition,
						_bNode.layer_yPosition AS path_bNode_layer_yPosition,
						_bNode.layer_zOffset AS path_bNode_layer_zOffset
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
			new Layer(
				result.path_aNode_layer_id,
				result.path_aNode_layer_name,
				result.path_aNode_layer_xPosition,
				result.path_aNode_layer_yPosition,
				result.path_aNode_layer_zOffset
			)
		);
		let bNode = new Node(
			result.path_bNode_id,
			result.path_bNode_xPosition,
			result.path_bNode_yPosition,
			new Layer(
				result.path_bNode_layer_id,
				result.path_bNode_layer_name,
				result.path_bNode_layer_xPosition,
				result.path_bNode_layer_yPosition,
				result.path_bNode_layer_zOffset
			)
		);

		return new Path(result.id, result.length, aNode, bNode);
	}

	/**
	 * Get all paths connected to a node.
	 * @param {Node} node the node to get paths for
	 * @returns {Path[]} the paths
	 */
	getNodePaths(node) {
		return this.#db
			.prepare(sql`SELECT id FROM path WHERE aNodeId = ? OR bNodeId = ?`)
			.all(node.getId(), node.getId())
			.map((row) => this.getPathById(row.id));
	}

	/**
	 * Get the path that connects two nodes.
	 * @param {Node} aNode the first node
	 * @param {Node} bNode the second node
	 * @returns {Path} the path
	 */
	getPathBetween(aNode, bNode) {
		let result = this.#db
			.prepare(
				sql`SELECT id FROM path WHERE (aNodeId = ? AND bNodeId = ?) OR (aNodeId = ? AND bNodeId = ?)`
			)
			.get(aNode.getId(), bNode.getId(), bNode.getId(), aNode.getId());
		return this.getPathById(result.id);
	}

	/**
	 * Create a new path.
	 * @param {number} aNodeId the first node of the path
	 * @param {number} bNodeId the second node of the path
	 * @param {number} length the length of the path
	 */
	createPath(aNodeId, bNodeId, length = null) {
		if (aNodeId === bNodeId) {
			throw new Error("Cannot create path between the same node");
		}

		let result = this.#db
			.prepare(
				sql`
					INSERT INTO path (aNodeId, bNodeId, length) VALUES (?, ?, ?)
				`
			)
			.run(
				aNodeId < bNodeId ? aNodeId : bNodeId,
				aNodeId > bNodeId ? aNodeId : bNodeId,
				length
			);

		return this.getPathById(result.lastInsertRowid);
	}

	/**
	 * Update a path.
	 * @param {number} pathId the ID of the path to update
	 * @param {number} length the new length of the path
	 * @returns {Path} the updated path
	 */
	updatePath(pathId, { length }) {
		this.#db
			.prepare(
				sql`
					UPDATE path
					SET length = ?
					WHERE id = ?
				`
			)
			.run(length, pathId);

		return this.getPathById(pathId);
	}

	/**
	 * Delete a path.
	 * @param {number} pathId the ID of the path to delete
	 */
	deletePath(pathId) {
		this.#db
			.prepare(
				sql`
					DELETE FROM path
					WHERE id = ?
				`
			)
			.run(pathId);
	}
}
