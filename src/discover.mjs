import * as path from "path";

async function findProjectImports(projectDirUrl, entryPointUrl, forceEsmDirUrls) {
	// set flag resolve hook can read
	global.ImportTrackingConfig = {
		projectDir: projectDirUrl,
        forceEsmDirs: forceEsmDirUrls
	};
	await import(entryPointUrl);
	global.ImportTrackingConfig = null;
	const pathsModule = await import("data://paths");
	return pathsModule.default;
}

async function findTestsInPaths(basePath, paths, symbol) {
	let allTestDescriptors = await Promise.all(paths.map(async (path) => {
		const module = await import(path);
		if (typeof module[symbol] !== "function") {
			return;
		}
		const prefix = testPrefix(basePath, new URL(path).pathname);
		const result = module[symbol]();
		let testsObject;
		if (result instanceof Promise) {
			testsObject = await result;
		} else {
			testsObject = result;
		}
		if (typeof testsObject === "object") {
			const testDescriptors = Object.entries(testsObject).map(([name, fn]) => {
				return {name: `${prefix}::${name}`, fn};
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
	return parts.join("::");
}

export default async function findTests(entryPoint, symbol, forceEsmDirs) {
	entryPoint = path.resolve(entryPoint);
	const entryPointUrl = `file://${entryPoint}`;
    const forceEsmDirUrls = (forceEsmDirs || []).map(dir => `file://${path.resolve(dir)}`);
	const projectDir = path.dirname(entryPoint);
	const projectDirUrl = `file://${projectDir}/`;

	let paths = await findProjectImports(projectDirUrl, entryPointUrl, forceEsmDirUrls);
	paths.sort();
	const tests = await findTestsInPaths(projectDir, paths, symbol);
	return tests;
}
