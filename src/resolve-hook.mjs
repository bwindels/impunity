const importedPaths = new Set();
const PATH_URL = "importtracking://paths";

export function resolve(specifier, parentModuleURL, defaultResolver) {
	if (specifier === PATH_URL) {
		return Promise.resolve({url: specifier});
	}
	const resolution = defaultResolver(specifier, parentModuleURL);
	if (global.ImportTrackingConfig) {
		const config = global.ImportTrackingConfig;
		if (resolution && resolution.url.startsWith(config.projectDir)) {
			importedPaths.add(resolution.url);
		}
	}

	return Promise.resolve(resolution);
}

export function getFormat(url, context, defaultFormat) {
    if (url === PATH_URL) {
        return Promise.resolve({format: "dynamic"});
    }
    const config = global.ImportTrackingConfig;
    if (config && config.forceEsm && url.startsWith(config.projectDir)) {
        return Promise.resolve({format: "module"});
    }

    return defaultFormat(url, context, defaultFormat);
}

export function dynamicInstantiate() {
	return Promise.resolve({
		execute: (exports) => {
			exports.paths.set(Array.from(importedPaths));
		},
		exports: ['paths']
	});
}
