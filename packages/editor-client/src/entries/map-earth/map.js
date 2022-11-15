import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Layers } from "../../js/leaflet.js";

export function init() {
	const map = L.map("map", {
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

	L.control.layers(Layers).addTo(map);

	map.on("baselayerchange", (data) => {
		map.setMaxZoom(data.layer.options.maxZoom);
	});

	return map;
}
