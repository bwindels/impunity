export async function tests() {
	await new Promise(r => setTimeout(r, 1000));
	return {
		foo: async (assert) => {
			await new Promise(r => setTimeout(r, 1000));
			assert(true);
		},
		bar: assert => assert(false),
	};
}

export const foo = 5;