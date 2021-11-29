#!/usr/bin/env node
const path = require("path");
const {spawn} = require('child_process');

const otherArgs = process.argv.slice(2);
spawn("node", [
	"--experimental-json-modules",
	"--experimental-loader",
	require.resolve("./src/resolve-hook.mjs"),
	require.resolve("./src/main.mjs"),
	...otherArgs
], {
	shell: true,
	stdio: "inherit"
});