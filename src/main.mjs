import * as commander from "commander";
import * as process from "process";
import findTests from "./discover.mjs";
import manifest from "../package.json";
import runTests from "./runner.mjs";
import * as path from "path";

const args = commander.default;
args
  .version(manifest.version)
  .option('--entry-point [file...]', 'the entry point of the import tree where to look for tests')
  .option('--symbol [symbol]', 'the function to look for in each file to return the tests object', "tests")
  .option('--root-dir [dir]', 'the function to look for in each file to return the tests object')
  .option('--force-esm-dirs [dirs...]', 'also assume .js files are ES modules in this directory')
  .parse(process.argv);

async function main() {
	let entryPoints = args.entryPoint.map(e => path.resolve(e));
	let rootDir = args.rootDir ? path.resolve(args.rootDir) : path.dirname(entryPoints[0]);
	const tests = await findTests(entryPoints, rootDir, args.symbol, args.forceEsmDirs);
	const failures = await runTests(tests);
	if (failures) {
		process.stdout.write(`Ran ${tests.length} test(s) with ${failures} failures.\n`);
	} else {
		process.stdout.write(`All ${tests.length} test(s) passed.\n`);
	}
	process.exit( failures ? -1 : 0 );
}

// eslint-disable-next-line no-console
main().catch(console.error);
