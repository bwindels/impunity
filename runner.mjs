import * as assert from "assert";
import * as commander from "commander";
import * as path from "path";
import findTests from "./discovery.mjs";
import runTests from "./runner.mjs";

const args = commander.default;
args
  .version('0.0.1')
  .option('--entryPoint [file]', 'the entry point of the import tree where to look for tests')
  .option('--symbol [symbol]', 'the function to look for in each file to return the tests object', "tests")
  .option('--force-esm', 'assume all the modules in the project are ES modules, independent of extensions')
  .parse(process.argv);

async function main() {
	const tests = await findTests(args.entryPoint, args.forceEsm, args.symbol);
	const success = runTests(tests);
	console.log("here are the tests", tests);
}

main().catch(console.error);