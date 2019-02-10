let trackingEnabled = false;
let projectDir;
let importedPaths = [];
let forceEsm = false;

export async function resolve(specifier,
                              parentModuleURL,
                              defaultResolver) {
	if (specifier === "importtracking://paths") {
		return {
			url: specifier,
			format: 'dynamic'
		};
	} else {
		const resolution = defaultResolver(specifier, parentModuleURL);
		if (global.ImportTrackingConfig) {
			const config = global.ImportTrackingConfig;
			if (resolution && resolution.url.startsWith(config.projectDir)) {
				importedPaths.push(resolution.url);
				if (config.forceEsm) {
					resolution.format = "esm";
				}
			}
		}
		return resolution;
	}
}

export async function dynamicInstantiate(url) {
	return {
		exports: ['paths'],
		execute: (exports) => {
			exports.paths.set(importedPaths.slice());
		}
	};
}

