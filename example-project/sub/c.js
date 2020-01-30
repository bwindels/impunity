export async function tests() {
	await new Promise(r => setTimeout(r, 1000));
	return {
		foo: async (assert) => {
			console.log("hello world!");
			await new Promise(r => setTimeout(r, 1000));
			assert(true);
		},
		bar: assert => {
			console.log("fail!");
			assert(false);
		},
	};
}

export const foo = 5;