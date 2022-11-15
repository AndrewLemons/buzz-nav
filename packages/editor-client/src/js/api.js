import Axios from "axios";

export async function createNode({ xPosition, yPosition, layerId }) {
	let { data } = await Axios.post("/api/nodes", {
		xPosition,
		yPosition,
		layerId,
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

export async function removeNode({}) {}
