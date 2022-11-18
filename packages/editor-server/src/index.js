import { config } from "dotenv";
config();

import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import Database from "@buzz-nav/database";
import editorPath from "@buzz-nav/editor-client";

const server = Fastify({
	ajv: {
		coerceTypes: true,
	},
});

const database = new Database();

server.set;
server.register(FastifyStatic, {
	root: editorPath,
	path: "/",
});

server.route({
	method: "GET",
	path: "/api/map",
	schema: {
		querystring: {
			type: "object",
			properties: {
				layerId: {
					type: "integer",
					minimum: 1,
				},
				latA: { type: "number" },
				lonA: { type: "number" },
				latB: { type: "number" },
				lonB: { type: "number" },
			},
			required: ["layerId", "latA", "lonA", "latB", "lonB"],
		},
	},
	handler: (req, reply) => {
		const nodes = database.node.getNodesInBounds(
			1,
			req.query.latA,
			req.query.lonA,
			req.query.latB,
			req.query.lonB
		);

		const paths = [];
		for (const node of nodes) {
			database.path.getNodePaths(node).forEach((path) => {
				paths.push(path);
			});
		}

		return {
			nodes: nodes.map((n) => n.toJSON()),
			paths: paths.map((n) => n.toJSON()),
		};
	},
});

server.route({
	method: "POST",
	path: "/api/nodes",
	schema: {
		body: {
			type: "object",
			properties: {
				xPosition: { type: "number" },
				yPosition: { type: "number" },
				layerId: { type: "integer", minimum: 1 },
			},
			required: ["xPosition", "yPosition", "layerId"],
		},
	},
	handler: (req, reply) => {
		let node = database.node.createNode(
			req.body.xPosition,
			req.body.yPosition,
			req.body.layerId
		);

		return {
			node,
		};
	},
});

server.route({
	method: "GET",
	path: "/api/nodes/:id",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
	},
	handler: (req, reply) => {
		let node = database.node.getNode(req.params.id);

		return {
			node,
		};
	},
});

server.route({
	method: "DELETE",
	path: "/api/nodes/:id",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
	},
	handler: (req, reply) => {
		database.node.deleteNode(req.params.id);
		return {
			success: true,
		};
	},
});

server.route({
	method: "PATCH",
	path: "/api/nodes/:id",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
		body: {
			type: "object",
			properties: {
				xPosition: { type: "number" },
				yPosition: { type: "number" },
				layerId: { type: "integer", minimum: 1 },
				info: { type: "string" },
			},
		},
	},
	handler: (req, reply) => {
		let node = database.node.updateNode(req.params.id, {
			xPosition: req.body.xPosition,
			yPosition: req.body.yPosition,
			layerId: req.body.layerId,
			info: req.body.info,
		});

		return {
			node,
		};
	},
});

server.route({
	path: "/api/paths/:id",
	method: "GET",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
	},
	handler: (req, reply) => {
		let path = database.path.getPath(req.params.id);

		return {
			path,
		};
	},
});

server.route({
	path: "/api/paths",
	method: "POST",
	schema: {
		body: {
			type: "object",
			properties: {
				aNodeId: { type: "integer", minimum: 1 },
				bNodeId: { type: "integer", minimum: 1 },
				length: { type: "number" },
			},
			required: ["aNodeId", "bNodeId"],
		},
	},
	handler: (req, reply) => {
		let path = database.path.createPath(
			req.body.aNodeId,
			req.body.bNodeId,
			req.body.length
		);

		return {
			path,
		};
	},
});

server.route({
	path: "/api/paths/:id",
	method: "DELETE",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
	},
	handler: (req, reply) => {
		database.path.deletePath(req.params.id);
		return {
			success: true,
		};
	},
});

server.route({
	path: "/api/paths/:id",
	method: "PATCH",
	schema: {
		params: {
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
			},
			required: ["id"],
		},
		body: {
			type: "object",
			properties: {
				aNodeId: { type: "integer", minimum: 1 },
				bNodeId: { type: "integer", minimum: 1 },
				length: { type: "number" },
			},
		},
	},
	handler: (req, reply) => {
		let path = database.path.updatePath(req.params.id, {
			aNodeId: req.body.aNodeId,
			bNodeId: req.body.bNodeId,
			length: req.body.length,
		});

		return {
			path,
		};
	},
});

server.listen({
	port: process.env.PORT ?? 8080,
});
