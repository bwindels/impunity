const importedPaths = new Set();
const PATH_URL = "data://paths";
// see importedPathsSource for how source is created
const PATHS_MODULE_FORMAT = "json";

export {transformSource} from "esbuild-node-loader";
import {resolve as resolveWithEsBuild, getFormat as getFormatWithEsBuild, load as loadEsBuild} from "esbuild-node-loader";

export async function resolve(specifier, context, defaultResolver) {
    if (specifier === PATH_URL) {
        return Promise.resolve({url: specifier, shortCircuit: true});
    }
    const resolution = await resolveWithEsBuild(specifier, context, defaultResolver);
    if (global.ImportTrackingConfig) {
        const config = global.ImportTrackingConfig;
        if (config && resolution && resolution.url.startsWith(config.projectDir)) {
            importedPaths.add(resolution.url);
        }
    }

    return Promise.resolve(Object.assign(resolution, {shortCircuit: true}));
}

export function getFormat(url, context, defaultFormat) {
    if (url === PATH_URL) {
        return Promise.resolve({format: PATHS_MODULE_FORMAT});
    }
    if (forceESM(global.ImportTrackingConfig, url)) {
        return Promise.resolve({format: "module"});
    }
    return getFormatWithEsBuild(url, context, defaultFormat);
}

// force .js files to be es modules if configured as such
function forceESM(config, url) {
    return config && url.endsWith(".js") && config.forceEsmDirs.some(dir => url.startsWith(dir));
}

// the source of PATH_URL
function importedPathsSource(importedPaths) {
    return JSON.stringify(Array.from(importedPaths.values()));
}

export function getSource(url, context, defaultGetSource) {
    if (url === PATH_URL) {
        return Promise.resolve({source: importedPathsSource(importedPaths)});
    }

    // Defer to Node.js for all other URLs.
    return defaultGetSource(url, context, defaultGetSource);
}

// New hook starting from Node v16.12.0
// See: https://github.com/nodejs/node/pull/37468
export function load(url, context, defaultLoad) {
    if (url === PATH_URL) {
        return {format: PATHS_MODULE_FORMAT, source: importedPathsSource(importedPaths), shortCircuit: true};
    } else {
        if (forceESM(global.ImportTrackingConfig, url)) {
            context.format = "module";
        }
        return Object.assign(loadEsBuild(url, context, defaultLoad), {shortCircuit: true});
    }
}