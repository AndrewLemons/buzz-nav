import "tailwindcss/lib/css/preflight.css";
import view from "../../views/map.html";
document.querySelector("body").innerHTML = view;

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Layers, Icons } from "../../js/leaflet.js";
import Axios from "axios";

let map = L.map("map", {
	center: [33.77709, -84.39781],
	zoom: 17,
	minZoom: 15,
	maxZoom: 21,
	maxBounds: [
		[33.78597, -84.41237],
		[33.76535, -84.38216],
	],
	layers: Object.values(Layers),
});

map.on("click", () => {
	window.parent.postMessage(
		JSON.stringify({
			message: "click",
		}),
		"*"
	);
});

map.on("baselayerchange", (data) => {
	map.setMaxZoom(data.layer.options.maxZoom);
});

L.control.layers(Layers).addTo(map);

let nodes = [];

function addNode(node) {
	let currentNode = nodes.find((n) => n.id === node.id);

	if (currentNode) {
		currentNode.marker.setLatLng([node.yPosition, node.xPosition]);
	} else {
		let marker = L.marker([node.yPosition, node.xPosition], {
			icon: Icons.Node,
		});
		marker.addTo(map);
		nodes.push({
			id: node.id,
			marker,
		});
	}
}

async function loadNodes() {
	let { data } = await Axios.get("/api/map", {
		params: {
			layerId: 1,
			latA: map.getBounds().getNorth(),
			lonA: map.getBounds().getWest(),
			latB: map.getBounds().getSouth(),
			lonB: map.getBounds().getEast(),
		},
	});

	return data.nodes;
}

async function load() {
	let nodes = await loadNodes();
	nodes.forEach(addNode);
}

load();

map.on("moveend", load);

map.on("click", async (e) => {
	let { data } = await Axios.post("/api/nodes", {
		xPosition: e.latlng.lng,
		yPosition: e.latlng.lat,
		layerId: 1,
	});

	addNode(data.node);
});

// L.marker([33.775196361534846, -84.39686826427179], {
// 	icon: Icons.Node,
// }).addTo(map);
// L.marker([33.77399474419329, -84.39688542258234], {
// 	icon: Icons.Node,
// }).addTo(map);

// L.polyline(
// 	[
// 		[33.775196361534846, -84.39686826427179],
// 		[33.77399474419329, -84.39688542258234],
// 	],
// 	{ color: "#EAAA00" }
// ).addTo(map);
