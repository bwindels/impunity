import * as process from "process";
import assert from "assert";
import colors from "colors/safe.js";

export default async function runTests(tests) {
	let failures = 0;
	for (let test of tests) {
		process.stdout.write(` * ${colors.bold(test.name)} ... `);
		const {fn} = test;
		try {
			const ret = fn(assert);
			if (ret instanceof Promise) {
				await ret;
			}
			process.stdout.write(`${colors.green("ok")}\n`);
		} catch (err) {
			process.stdout.write(`${colors.red("failed")}\n`);
			// eslint-disable-next-line no-console
			console.log(err.stack);
			failures += 1;
		}
	}

	return failures;
}