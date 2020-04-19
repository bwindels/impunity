import * as process from "process";
import assert from "assert";
import colors from "colors/safe.js";

class OutputBuffer {
	constructor(streams) {
		this._streams = streams;
		this._chunks = [];
		this._write = data => this._chunks.push(data.toString());
	}

	start() {
		for (const s of this._streams) {
			s.write = this._write;
		}
	}

	stop() {
		for (const s of this._streams) {
			delete s.write;
		}
		const text = this._chunks.join("");
		this._chunks = [];
		return text;
	}
}

const TIMEOUT = 5000;	// all tests should be done in 5s

export default async function runTests(tests) {
	let failures = 0;
	const buffer = new OutputBuffer([process.stdout, process.stderr]);
	for (let test of tests) {
		process.stdout.write(` * ${colors.bold(test.name)} ... `);
		const {fn} = test;
		let error;
		buffer.start();
		try {
			const ret = fn(assert);
			if (ret instanceof Promise) {
				const timeout = new Promise((_, reject) => {
					setTimeout(() => reject(new Error(`Test timed out after ${TIMEOUT}ms`)), TIMEOUT);
				});
				await Promise.race([ret, timeout]);
			}
		} catch (err) {
			error = err;
		}
		const output = buffer.stop();
		if (error) {
			process.stdout.write(`${colors.red("failed")}\n`);
			process.stdout.write(output);
			// eslint-disable-next-line no-console
			console.log(error.stack);
			failures += 1;
		} else {
			process.stdout.write(`${colors.green("ok")}\n`);
		}
	}

	return failures;
}