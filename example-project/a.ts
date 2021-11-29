import "./sub/b.js";

function exp(n: number): number {
	return n * n;
}

export function tests() {
	return {
		lala: assert => assert.equal(true, true),
		exp: assert => assert.equal(exp(5), 25)
	};
}