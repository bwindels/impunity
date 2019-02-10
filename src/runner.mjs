import * as process from "process";
import assert from "assert";
import colors from "colors/safe";

export default function runTests(tests) {
	let failures = 0;
	tests.forEach(test => {
		process.stdout.write(` * ${colors.bold(test.name)} ... `);
		const {fn} = test;
		try {
			fn(assert);
			process.stdout.write(`${colors.green("ok")}\n`);
		} catch (err) {
			process.stdout.write(`${colors.red("failed")}\n`);
			// eslint-disable-next-line no-console
			console.log(err.stack);
			failures += 1;
		}
	});

	return failures;
}