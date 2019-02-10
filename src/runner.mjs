import assert from "assert";
import colors from "colors/safe";

export default function runTests(tests) {
	let success = true;
	tests.forEach(test => {
		process.stdout.write(` * ${colors.bold(test.name)} ... `);
		try {
			test.fn(assert);
			process.stdout.write(`${colors.green("success")}\n`);
		} catch (err) {
			process.stdout.write(`${colors.red("failed")}\n`);
			console.log(err.stack);
			success = false;
		}
	});
	return success;
}