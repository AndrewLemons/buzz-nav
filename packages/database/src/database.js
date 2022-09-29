import sqlite from "better-sqlite3";

import PathService from "./services/path.js";
import NodeService from "./services/node.js";
import LayerService from "./services/layer.js";

export default class Database {
	#db;
	layer;
	node;
	path;

	/**
	 * @param {string} databasePath
	 */
	constructor(databasePath) {
		this.#db = new sqlite(databasePath ?? ":memory:");

		this.layer = new LayerService(this.#db);
		this.node = new NodeService(this.#db);
		this.path = new PathService(this.#db);
	}
}
