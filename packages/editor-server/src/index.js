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
		const nodes = database.node
			.getNodesInBounds(
				1,
				req.query.latA,
				req.query.lonA,
				req.query.latB,
				req.query.lonB
			)
			.map((node) => node.toJSON());

		return {
			nodes,
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

server.listen({
	port: process.env.PORT ?? 8080,
});
