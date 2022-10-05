import "leaflet/dist/leaflet.css";
import L from "leaflet";

import NodeIconImage from "../assets/node-marker-icon.png";

export const Layers = {
	Esri: L.tileLayer(
		"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		{
			maxZoom: 20,
			attribution: '<a href="http://www.esri.com/">Powered by Esri</a>',
		}
	),
	Google: L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
		maxZoom: 21,
		subdomains: ["mt0", "mt1", "mt2", "mt3"],
		attribution:
			"Imagery ©2022 CNES / Airbus, Maxar Technologies, Sanborn, U.S. Geological Survey",
	}),
};

export const Icons = {
	Node: L.icon({
		iconUrl: NodeIconImage,
		iconSize: [16, 16],
		iconAnchor: [8, 8],
	}),
};

export default L;
