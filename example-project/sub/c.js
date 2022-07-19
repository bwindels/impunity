import d from "../../other-example-code/d.js";

export async function tests() {
	await new Promise(r => setTimeout(r, 1000));
	return {
		foo: async (assert) => {
			console.log("hello world!");
			await new Promise(r => setTimeout(r, 1000));
			assert.equal(d.lol, 7);
		},
		bar: assert => {
			console.log("fail!");
			assert(false);
		},
		timeout: () => new Promise(() => {}), // will never resolve
	};
}

export const foo = 5;