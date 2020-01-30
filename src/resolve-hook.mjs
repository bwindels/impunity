const importedPaths = new Set();

export function resolve(specifier, parentModuleURL, defaultResolver) {
	if (specifier === "importtracking://paths") {
		return Promise.resolve({
			format: 'dynamic',
			url: specifier
		});
	}
	const resolution = defaultResolver(specifier, parentModuleURL);
	if (global.ImportTrackingConfig) {
		const config = global.ImportTrackingConfig;
		if (resolution && resolution.url.startsWith(config.projectDir)) {
			importedPaths.add(resolution.url);
			if (config.forceEsm) {
				resolution.format = "module";
			}
		}
	}

	return Promise.resolve(resolution);
}

export function dynamicInstantiate() {
	return Promise.resolve({
		execute: (exports) => {
			exports.paths.set(Array.from(importedPaths));
		},
		exports: ['paths']
	});
}