import { ComplexMath, sql } from "@buzz-nav/utilities";
import Node from "../models/node.js";
import Layer from "../models/layer.js";

export default class NodeService {
	#db;

	/**
	 * Create a new node service.
	 * @param {*} database
	 */
	constructor(database) {
		this.#db = database;
		this.#initDatabase();
	}

	/**
	 * Initialize the node portion of the database.
	 * @private
	 */
	#initDatabase() {
		this.#db
			.prepare(
				sql`
					CREATE TABLE IF NOT EXISTS node (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						xPosition REAL NOT NULL,
						yPosition REAL NOT NULL,
						layerId INTEGER NOT NULL,
						info TEXT,
						FOREIGN KEY (layerId) REFERENCES layer (id)
					)
				`
			)
			.run();
	}

	/**
	 * Get a node by its ID.
	 * @param {number} nodeId the ID of the node to get
	 * @returns {Node} the node
	 */
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
			),
			result.info
		);
	}

	/**
	 * Search all nodes' info for a given query.
	 * @param {string} search the query to search for
	 * @returns {Node[]} the nodes that match the query
	 */
	getNodesByInfoSearch(search) {
		let results = this.#db
			.prepare(
				sql`
					SELECT
						node.*,
						layer.id AS layer_id,
						layer.name AS layer_name,
						layer.xPosition AS layer_xPosition,
						layer.yPosition AS layer_yPosition,
						layer.zOffset AS layer_zOffset
					FROM node
					JOIN layer ON
						layer.id = node.layerId AND
						node.info LIKE ?
				`
			)
			.all(`%${search}%`)
			.map((node) => {
				return new Node(
					node.id,
					node.xPosition,
					node.yPosition,
					new Layer(
						node.layer_id,
						node.layer_name,
						node.layer_xPosition,
						node.layer_yPosition,
						node.layer_zOffset
					),
					node.info
				);
			});

		return results;
	}

	/**
	 * Create a new node.
	 * @param {number} xPosition the X position of the node
	 * @param {number} yPosition the Y position of the node
	 * @param {number} layerId the ID of the layer the node is on
	 * @returns {Node} the created node
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

	/**
	 * Delete a node.
	 * @param {number} nodeId the ID of the node to delete
	 */
	deleteNode(nodeId) {
		this.#db
			.prepare(
				sql`
					DELETE FROM node WHERE id = ?
				`
			)
			.run(nodeId);
	}

	/**
	 * Update a node.
	 * @param {number} nodeId the ID of the node to update
	 * @param {number} xPosition the new X position of the node
	 * @param {number} yPosition the new Y position of the node
	 * @param {number} layerId the new ID of the layer the node is on
	 * @param {string} info the new info of the node
	 * @returns {Node} the updated node
	 */
	updateNode(nodeId, { xPosition, yPosition, layerId, info }) {
		let node = this.getNodeById(nodeId);

		this.#db
			.prepare(
				sql`
					UPDATE node SET xPosition = ?, yPosition = ?, layerId = ?, info = ? WHERE id = ?
				`
			)
			.run(
				xPosition ?? node.getXPosition(),
				yPosition ?? node.getYPosition(),
				layerId ?? node.getLayer().getId(),
				info ?? node.getInfo(),
				nodeId
			);

		return this.getNodeById(nodeId);
	}

	/**
	 * Get all nodes within a bounds.
	 * @param {number} layerId the ID of the layer to get nodes from
	 * @param {number} latA the minimum latitude position of the bounds
	 * @param {number} lonA the minimum longitude position of the bounds
	 * @param {number} latB the maximum latitude position of the bounds
	 * @param {number} lonB the maximum longitude position of the bounds
	 * @returns {Node[]} the nodes within the bounds
	 */
	getNodesInBounds(layerId, latA, lonA, latB, lonB) {
		let lowLat = Math.min(latA, latB);
		let highLat = Math.max(latA, latB);
		let lowLon = Math.min(lonA, lonB);
		let highLon = Math.max(lonA, lonB);

		return this.#db
			.prepare(
				sql`
					SELECT
						node.*,
						layer.id AS layer_id,
						layer.name AS layer_name,
						layer.xPosition AS layer_xPosition,
						layer.yPosition AS layer_yPosition,
						layer.zOffset AS layer_zOffset
					FROM node
					JOIN layer ON 
						layer.id = node.layerId AND (
							node.layerId = ? AND
							node.xPosition BETWEEN ? AND ? AND
							node.yPosition BETWEEN ? AND ?
						)
				`
			)
			.all(layerId, lowLon, highLon, lowLat, highLat)
			.map((node) => {
				return new Node(
					node.id,
					node.xPosition,
					node.yPosition,
					new Layer(
						node.layer_id,
						node.layer_name,
						node.layer_xPosition,
						node.layer_yPosition,
						node.layer_zOffset
					),
					node.info
				);
			});
	}
}
