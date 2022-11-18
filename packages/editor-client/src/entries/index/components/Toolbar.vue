<template>
	<div
		class="flex flex-row items-center justify-center p-1 gap-1 bg-opacity-50 bg-black rounded-md"
	>
		<ToolbarItem
			icon="arrow-pointer"
			:isSelected="selectedTool === 'select'"
			@click="setSelectedTool('select')"
			title="Select"
		/>
		<ToolbarItem
			icon="arrows-up-down-left-right"
			:isSelected="selectedTool === 'move'"
			@click="setSelectedTool('move')"
			title="Move nodes"
		/>
		<ToolbarItem
			icon="plus"
			:isSelected="selectedTool === 'add-node'"
			@click="setSelectedTool('add-node')"
			title="Add node"
		/>
		<ToolbarItem
			icon="circle-nodes"
			:isSelected="selectedTool === 'add-path'"
			@click="setSelectedTool('add-path')"
			title="Add path"
		/>
		<ToolbarItem
			icon="trash"
			:isSelected="selectedTool === 'delete'"
			@click="setSelectedTool('delete')"
			title="Delete path/node"
		/>
	</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ToolbarItem from "./ToolbarItem.vue";

export default {
	name: "Toolbar",
	components: {
		ToolbarItem,
	},
	computed: {
		...mapState(["selectedTool"]),
	},
	methods: {
		...mapMutations(["setSelectedTool"]),
	},
};
</script>
