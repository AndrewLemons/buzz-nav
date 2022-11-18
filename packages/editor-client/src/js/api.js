import Axios from "axios";

export async function createNode({ xPosition, yPosition, layerId }) {
	let { data } = await Axios.post("/api/nodes", {
		xPosition,
		yPosition,
		layerId,
	});

	return data.node;
}

export async function createPath({ aNodeId, bNodeId, length }) {
	let { data } = await Axios.post("/api/paths", {
		aNodeId,
		bNodeId,
		length,
	});

	return data.path;
}

export async function removeNode(nodeId) {
	let { data } = await Axios.delete(`/api/nodes/${nodeId}`);
	if (data.success === false) {
		throw new Error("Failed to remove node");
	}
}

export async function removePath(pathId) {
	let { data } = await Axios.delete(`/api/paths/${pathId}`);
	if (data.success === false) {
		throw new Error("Failed to remove path");
	}
}

export async function updateNode(
	nodeId,
	{ xPosition, yPosition, layerId, info }
) {
	let { data } = await Axios.patch(`/api/nodes/${nodeId}`, {
		xPosition,
		yPosition,
		layerId,
		info,
	});
	return data.node;
}

export async function updatePath(pathId, { aNodeId, bNodeId, length }) {
	let { data } = await Axios.patch(`/api/paths/${pathId}`, {
		aNodeId,
		bNodeId,
		length,
	});
	return data.path;
}

export async function getMapByBoundingBox({ layerId, latA, lonA, latB, lonB }) {
	let { data } = await Axios.get("/api/map", {
		params: {
			layerId,
			latA,
			lonA,
			latB,
			lonB,
		},
	});

	return data;
}

export async function getNode(nodeId) {
	let { data } = await Axios.get(`/api/nodes/${nodeId}`);
	return data.node;
}

export async function getPath(pathId) {
	let { data } = await Axios.get(`/api/paths/${pathId}`);
	return data.path;
}
