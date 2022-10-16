const path = require("node:path");
const ejs = require("ejs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
	mode: "development",
	entry: {
		index: "./src/entries/index/index.js",
		"map-earth": "./src/entries/map-earth/index.js",
		"map-flat": "./src/entries/map-flat/index.js",
	},
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
				use: "vue-loader",
			},
			{
				test: /\.html$/,
				loader: "html-loader",
				options: {
					sources: true,
				},
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
			template: "./src/views/index.html",
			chunks: ["index"],
			filename: "index.html",
		}),
		new HtmlWebpackPlugin({
			template: "./src/views/index.html",
			chunks: ["map-earth"],
			filename: "map-earth.html",
		}),
		new HtmlWebpackPlugin({
			template: "./src/views/index.html",
			chunks: ["map-flat"],
			filename: "map-flat.html",
		}),
	],
};
