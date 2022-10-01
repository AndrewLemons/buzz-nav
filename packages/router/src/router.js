import Database, { Node } from "@buzz-nav/database";
import Route from "./route.js";

export default class Router {
	#db;

	/**
	 * @param {Database} database
	 */
	constructor(database) {
		this.#db = database;
	}

	/**
	 * @param {Node} startNode
	 * @param {Node} endNode
	 * @returns {Route}
	 */
	findRoute(startNode, endNode) {
		let openSet = [startNode];
		let nodeHistory = [];

		let gScore = [];
		gScore[startNode.getId()] = 0;

		let fScore = [];
		fScore[startNode.getId()] = startNode.getDistanceTo(endNode);

		while (openSet.length > 0) {
			let currentNode = openSet[0];
			let lowestFScore = Infinity;
			for (let i = 0; i < openSet.length; i++) {
				if (fScore[openSet[i].getId()] < lowestFScore) {
					currentNode = openSet[i];
					lowestFScore = fScore[openSet[i].getId()];
				}
			}

			if (currentNode.getId() === endNode.getId()) {
				let nodes = this.reconstructPath(nodeHistory, currentNode);
				return this.createRouteFromNodes(nodes);
			}

			openSet = openSet.filter((node) => node.getId() !== currentNode.getId());

			let paths = this.#db.path.getNodePaths(currentNode);
			for (let i = 0; i < paths.length; i++) {
				let path = paths[i];
				let neighborNode = path.getOtherNode(currentNode);

				let tentativeGScore = gScore[currentNode.getId()] + path.getLength();

				if (tentativeGScore <= (gScore[neighborNode.getId()] ?? Infinity)) {
					nodeHistory[neighborNode.getId()] = currentNode;
					gScore[neighborNode.getId()] = tentativeGScore;
					fScore[neighborNode.getId()] =
						tentativeGScore + currentNode.getDistanceTo(endNode);

					if (!openSet.includes(neighborNode)) {
						openSet.push(neighborNode);
					}
				}
			}
		}

		return new Route([]);
	}

	/**
	 * @param {Node[]} nodeHistory
	 * @param {Node} currentNode
	 * @returns {Node[]}
	 */
	reconstructPath(nodeHistory, currentNode) {
		let totalPath = [currentNode];
		while (nodeHistory[currentNode.getId()]) {
			currentNode = nodeHistory[currentNode.getId()];
			totalPath.unshift(currentNode);
		}
		return totalPath;
	}

	/**
	 * @param {Node[]} nodes
	 * @returns {Route}
	 */
	createRouteFromNodes(nodes) {
		let paths = [];
		for (let i = 0; i < nodes.length - 1; i++) {
			paths.push(this.#db.path.getPathBetween(nodes[i], nodes[i + 1]));
		}
		return new Route(paths);
	}
}
