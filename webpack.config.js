const path = require("path");

/** @typedef {import("webpack").Configuration} WebpackConfig **/

const TS_MODULE = {
	rules: [
		{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [
				{ loader: "ts-loader" }
			]
		}
	]
};

// Config to run the extension in the browser context (like for github.dev)
/** @type WebpackConfig */
const browserClientConfig = {
	context: path.resolve(__dirname, "client"),
	mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to "production")
	target: "webworker",
	entry: {
		extension: "./src/web/extension.ts",
		'test/index': "./src/test/index.ts"
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "client", "dist", "web"),
		libraryTarget: "commonjs"
	},
	resolve: {
		mainFields: ["module", "main"],
		extensions: [".ts", ".js"],
		alias: {},
		fallback: {
			util: require.resolve("util"),
			buffer: require.resolve("buffer"),
			assert: require.resolve("assert"),
			stream: require.resolve("stream-browserify"),
			tty: require.resolve("tty-browserify"),
			fs: require.resolve("browserfs"),
			buffer: require.resolve("buffer"),
			os: require.resolve("os-browserify"),
			path: require.resolve("path-browserify")
		}
	},
	module: TS_MODULE,
	externals: { vscode: "commonjs vscode" },
	performance: { hints: false }
};

const browserServerConfig = {
	context: path.resolve(__dirname, "server"),
	mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to "production")
	target: "webworker",
	entry: {
		extension: "./src/web/server.ts"
		// UNIMPLEMENTED: Unit tests
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "server", "dist", "web"),
		libraryTarget: "commonjs"
	},
	resolve: {
		mainFields: ["module", "main"],
		extensions: [".ts", ".js"],
		alias: {},
		fallback: {}
	},
	module: TS_MODULE,
	externals: { vscode: "commonjs vscode" },
	performance: { hints: false }
};

module.exports = [browserClientConfig, browserServerConfig];