export function tests() {
	return {
		foo: assert => assert(true),
		bar: assert => assert(false),
	};
}

export const foo = 5;