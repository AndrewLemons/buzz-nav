<template>
	<div class="flex flex-col w-screen h-screen">
		<div class="bg-tech-gold shadow-lg h-16 py-1 px-4 z-10">
			<img
				class="h-full"
				src="./assets/logo_on-gold.svg"
				alt="Buzz Nav"
			/>
		</div>
		<Map class="flex-grow w-screen" />
	</div>
</template>

<script>
import Map from "./components/Map.vue";

export default {
	name: "App",
	components: {
		Map,
	},
};
</script>
