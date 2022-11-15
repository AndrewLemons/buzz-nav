<template>
	<div
		class="flex flex-row items-center justify-center p-1 gap-1 bg-opacity-50 bg-black rounded-md"
	>
		<div
			:class="[
				'aspect-square p-2 rounded-md cursor-pointer ring-tech-gold hover:ring-1',
				selectedTool === 'move' && 'bg-tech-gold',
			]"
			@click="setSelectedTool('move')"
		>
			<icon
				icon="arrows-up-down-left-right"
				:style="{ color: '#FFF' }"
			/>
		</div>
		<div
			:class="[
				'aspect-square p-2 rounded-md cursor-pointer ring-tech-gold hover:ring-1',
				selectedTool === 'add' && 'bg-tech-gold',
			]"
			@click="setSelectedTool('add')"
		>
			<icon
				icon="plus"
				:style="{ color: '#FFF' }"
			/>
		</div>
		<div
			:class="[
				'aspect-square p-2 rounded-md cursor-pointer ring-tech-gold hover:ring-1',
				selectedTool === 'trash' && 'bg-tech-gold',
			]"
			@click="setSelectedTool('trash')"
		>
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
	data: () => ({
		selectedTool: "select",
	}),
	methods: {
		setSelectedTool(tool) {
			if (this.selectedTool === tool) {
				sessionStorage.setItem("selectedTool", "select");
				this.selectedTool = "select";
			} else {
				sessionStorage.setItem("selectedTool", tool);
				this.selectedTool = tool;
			}
		},
	},
	mounted() {
		this.selectedTool = sessionStorage.getItem("selectedTool");

		window.addEventListener("storage", (e) => {
			if (e.key === "selectedTool") {
				this.selectedTool = e.newValue;
			}
		});
	},
};
</script>

<style>
#icon {
	stroke: white;
}
</style>
