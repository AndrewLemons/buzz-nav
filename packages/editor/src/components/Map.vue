<template>
	<div
		id="map"
		:class="class"
	/>
</template>

<script>
import L, { Layers, Icons } from "../libs/leaflet";

export default {
	name: "Map",
	props: ["class"],
	mounted() {
		let map = L.map("map", {
			center: [33.776958, -84.397814],
			zoom: 17,
			minZoom: 15,
			maxZoom: 21,
			maxBounds: [
				[33.781589, -84.407472],
				[33.768289, -84.385329],
			],
			layers: Object.values(Layers),
		});

		map.on("baselayerchange", (data) => {
			map.setMaxZoom(data.layer.options.maxZoom);
		});

		L.control.layers(Layers).addTo(map);

		L.marker([33.775196361534846, -84.39686826427179], {
			icon: Icons.Node,
		}).addTo(map);
		L.marker([33.77399474419329, -84.39688542258234], {
			icon: Icons.Node,
		}).addTo(map);

		L.polyline(
			[
				[33.775196361534846, -84.39686826427179],
				[33.77399474419329, -84.39688542258234],
			],
			{ color: "#EAAA00" }
		).addTo(map);
	},
};
</script>
