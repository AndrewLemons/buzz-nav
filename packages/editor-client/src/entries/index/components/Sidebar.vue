<template>
	<div class="flex flex-col gap-3 p-4 md:w-96 bg-gray-800 text-white">
		<h1 class="text-2xl font-bold">Selected</h1>
		<p v-if="!selectedElement">Nothing is selected.</p>
		<div
			v-else
			class="flex flex-col gap-3"
		>
			<div
				v-if="selectedElementType === 'node'"
				class="flex flex-col gap-3"
			>
				<table>
					<tr>
						<th colspan="2">Node</th>
					</tr>
					<tr>
						<td>ID</td>
						<td>{{ selectedElement?.id }}</td>
					</tr>
					<tr>
						<td>X Position</td>
						<td>
							{{ selectedElement?.xPosition }}
						</td>
					</tr>
					<tr>
						<td>Y Position</td>
						<td>
							{{ selectedElement?.yPosition }}
						</td>
					</tr>
					<tr>
						<td>Layer</td>
						<td>{{ selectedElement?.layer.id }}</td>
					</tr>
				</table>
				<table>
					<tr>
						<th>Info</th>
					</tr>
					<tr>
						<td>{{ selectedElement?.info ?? "None" }}</td>
					</tr>
				</table>
			</div>
			<div
				v-else-if="selectedElementType === 'path'"
				class="flex flex-col gap-3"
			>
				<div
					v-if="selectedElementType === 'path'"
					class="flex flex-col gap-3"
				>
					<table>
						<tr>
							<th colspan="2">Path</th>
						</tr>
						<tr>
							<td>ID</td>
							<td>{{ selectedElement?.id }}</td>
						</tr>
						<tr>
							<td>Node A</td>
							<td>{{ selectedElement?.aNode.id }}</td>
						</tr>
						<tr>
							<td>Node B</td>
							<td>{{ selectedElement?.bNode.id }}</td>
						</tr>
						<tr>
							<td>Length</td>
							<td>{{ selectedElement?.length }}</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import * as Api from "../../../js/api.js";

export default {
	name: "Sidebar",
	data: () => ({
		selectedElementType: "none",
		selectedElement: null,
	}),
	mounted() {
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === "setSelectedElement") {
				this.selectedElementType = state.selectedElement.type;
				if (this.selectedElementType === "node") {
					Api.getNode(state.selectedElement.id).then((node) => {
						this.selectedElement = node;
					});
				} else if (this.selectedElementType === "path") {
					Api.getPath(state.selectedElement.id).then((path) => {
						this.selectedElement = path;
					});
				} else {
					this.selectedElement = null;
				}
			}
		});
	},
};
</script>
