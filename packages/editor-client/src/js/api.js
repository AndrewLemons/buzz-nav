import Axios from "axios";

export async function createNode({ xPosition, yPosition, layerId }) {
	let { data } = await Axios.post("/api/nodes", {
		xPosition,
		yPosition,
		layerId,
	});

	return data.node;
}

export async function removeNode(nodeId) {
	let { data } = await Axios.delete(`/api/nodes/${nodeId}`);
	if (data.success === false) {
		throw new Error("Failed to remove node");
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

export async function getNodesByBoundingBox({
	layerId,
	latA,
	lonA,
	latB,
	lonB,
}) {
	let { data } = await Axios.get("/api/map", {
		params: {
			layerId,
			latA,
			lonA,
			latB,
			lonB,
		},
	});

	return data.nodes;
}
