const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("node:path");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		path: path.resolve(process.cwd(), "./dist"),
		filename: "[id].[fullhash:6].js",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.(svg)|(png)$/,
				type: "asset/resource",
				generator: {
					filename: "images/[hash:6][ext]",
				},
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],
};
