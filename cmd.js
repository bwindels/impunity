#!/usr/bin/env node
const path = require("path");
const {spawn} = require('child_process');

const installDir = path.dirname(path.resolve(process.argv[1]));
const otherArgs = process.argv.slice(2);
spawn("node", [
	"--experimental-json-modules",
	"--experimental-loader",
	`${installDir}/src/resolve-hook.mjs`,
	`${installDir}/src/main.mjs`,
	...otherArgs
], {
	shell: true,
	stdio: "inherit"
});