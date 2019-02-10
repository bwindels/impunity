import * as assert from "assert";
import * as commander from "commander";
import * as path from "path";

const args = commander.default;
args
  .version('0.0.1')
  .option('--entryPoint [file]', 'the entry point of the import tree where to look for tests')
  .option('--symbol', 'the function to look for in each file to return the tests object', "tests")
  .option('--force-esm', 'assume all the modules in the project are ES modules, independent of extensions')
  .parse(process.argv);

async function findProjectImports(projectDir, entryPoint, forceEsm) {
	// set flag resolve hook can read
	global.ImportTrackingConfig = {
		projectDir: `file://${projectDir}`,
		forceEsm: forceEsm
	};
	await import(entryPoint);
	global.ImportTrackingConfig = null;
	const {paths} = await import("importedpaths://");
	return paths;
}

async function findTests(basePath, paths) {
	let allTestDescriptors = await Promise.all(paths.map(async (path) => {
		const module = await import(path);
		if (typeof module.tests !== "function") {
			return;
		}
		const prefix = testPrefix(basePath, new URL(path).pathname);
		const testsObject = module.tests();
		if (typeof testsObject === "object") {
			const testDescriptors = Object.entries(testsObject).map(([name, fn]) => {
				return {name: `${prefix}_${name}`, fn};
			});
			return testDescriptors;
		}
	}));
	allTestDescriptors = allTestDescriptors.filter(d => !!d);
	allTestDescriptors = allTestDescriptors.reduce((all, d) => all.concat(d), []);
	return allTestDescriptors;
}

function testPrefix(basePath, path) {
	let subPath = path;
	if (path.startsWith(basePath)) {
		subPath = subPath.substr(basePath.length + 1);
	}
	const parts = subPath.split("/");
	let lastPart = parts[parts.length - 1];
	const extIdx = lastPart.lastIndexOf(".");
	if (extIdx !== -1) {
		lastPart = lastPart.substr(0, extIdx);
		parts[parts.length - 1] = lastPart;
	}
	return parts.join("_");
}

async function main(entryPoint, forceEsm) {
	const projectDir = path.dirname(path.resolve(entryPoint));
	let paths = await findProjectImports(projectDir, entryPoint, forceEsm);
	paths.sort();
	const tests = await findTests(projectDir, paths);
	console.log("here are the imported files", tests);
}

main(args.entryPoint, args.forceEsm).catch(console.error);