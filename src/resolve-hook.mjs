const importedPaths = new Set();
const PATH_URL = "data://paths";

export function resolve(specifier, context, defaultResolver) {
    if (specifier === PATH_URL) {
        return Promise.resolve({url: specifier});
    }
    const resolution = defaultResolver(specifier, context);
    if (global.ImportTrackingConfig) {
        const config = global.ImportTrackingConfig;
        if (config && resolution && resolution.url.startsWith(config.projectDir)) {
            importedPaths.add(resolution.url);
        }
    }

    return Promise.resolve(resolution);
}

export function getFormat(url, context, defaultFormat) {
    if (url === PATH_URL) {
        return Promise.resolve({format: "json"});
    }
    const config = global.ImportTrackingConfig;
    if (config && url.endsWith(".js") && config.forceEsmDirs.some(dir => url.startsWith(dir))) {
        return Promise.resolve({format: "module"});
    }

    return defaultFormat(url, context, defaultFormat);
}

export function getSource(url, context, defaultGetSource) {
    if (url === PATH_URL) {
        const json = JSON.stringify(Array.from(importedPaths.values()));

        return Promise.resolve({source: json});
    }

    // Defer to Node.js for all other URLs.
    return defaultGetSource(url, context, defaultGetSource);
}
