<template>
	<div class="flex flex-col h-screen w-screen">
		<div class="flex flex-row bg-tech-gold shadow-lg h-16 py-1 px-4">
			<div class="flex flex-row basis-full justify-start">
				<img
					class="h-full"
					src="../../assets/logo_on-gold.svg"
					alt="Buzz Nav"
				/>
			</div>
			<div class="flex flex-row basis-full justify-center items-center">
				<Toolbar />
			</div>
			<div class="flex flex-row basis-full justify-end"></div>
		</div>
		<div class="flex flex-row h-full">
			<iframe
				id="map"
				src="/map-earth.html"
				class="w-full flex-grow"
			></iframe>
			<Sidebar />
		</div>
	</div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
	name: "App",
	components: {
		Toolbar,
		Sidebar,
	},
};
</script>
