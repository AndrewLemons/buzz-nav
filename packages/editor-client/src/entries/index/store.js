import { createStore } from "vuex";

const store = createStore({
	state: () => ({
		selectedTool: "select",
		selectedElement: {
			type: "none",
			id: null,
		},
	}),
	mutations: {
		setSelectedTool(state, tool) {
			state.selectedTool = tool;
			sessionStorage.setItem("selectedTool", tool);
		},
		setSelectedElement(state, { type, id }) {
			state.selectedElement = {
				type,
				id,
			};
		},
	},
});

window.addEventListener("storage", (event) => {
	if (event.key === "selectedTool") {
		store.commit("setSelectedTool", event.newValue);
	} else if (event.key === "selectedElement") {
		let newValue = JSON.parse(event.newValue);
		store.commit("setSelectedElement", newValue);
	}
});

export default store;
