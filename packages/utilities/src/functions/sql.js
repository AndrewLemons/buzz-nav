export default (input) =>
	input[0]
		.replaceAll(/[\n\s]+/g, " ")
		.replace(/^[\s\n]*/, "")
		.replace(/[\s\n]*$/, "");
