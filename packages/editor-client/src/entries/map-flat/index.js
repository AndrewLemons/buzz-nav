import view from "../../views/map.html";
document.querySelector("body").innerHTML = view;

import "leaflet/dist/leaflet.css";
import L from "leaflet";

let map = L.map("map", {
	center: [0, 0],
	zoom: 1,
	crs: L.CRS.Simple,
});
