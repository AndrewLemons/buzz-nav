<template>
	<div
		:class="[
			'aspect-square p-2 rounded-md cursor-pointer ring-tech-gold hover:ring-1',
			isSelected && 'bg-tech-gold',
		]"
		@click="$emit('click')"
	>
		<icon
			:icon="icon"
			:style="{ color: '#FFF' }"
		/>
	</div>
</template>

<script>
export default {
	name: "ToolbarItem",
	emits: ["click"],
	props: {
		icon: {
			type: String,
			required: true,
		},
		isSelected: {
			type: Boolean,
			required: true,
		},
	},
};
</script>
