<template>
	<div
		class="flex flex-row items-center justify-center p-1 bg-opacity-50 bg-black rounded-md"
	>
		<div class="aspect-square p-2 rounded-md cursor-pointer hover:bg-tech-gold">
			<icon
				icon="arrows-up-down-left-right"
				:style="{ color: '#FFF' }"
			/>
		</div>
		<div class="aspect-square p-2 rounded-md cursor-pointer hover:bg-tech-gold">
			<icon
				icon="plus"
				:style="{ color: '#FFF' }"
			/>
		</div>
		<div class="aspect-square p-2 rounded-md cursor-pointer hover:bg-tech-gold">
			<icon
				icon="trash"
				:style="{ color: '#FFF' }"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: "Toolbar",
};
</script>

<style>
#icon {
	stroke: white;
}
</style>
