# Inline JS tests

Do you like keeping your unit tests close to your code? Inspired by rust's cargo, I want to write unit tests in the same file as the code they test. With this module, you write the following in any module:

```javascript
export default class SomeClass {

}

//#ifdef TESTS
export function tests() {
	return {
		test_a(assert) {
			assert(new SomeClass().a, undefined);
		}
	}
}
//#endif
```

You run the tests with `js-inline-tests --entryPoint your/main.js` (use `--force-esm` if you use ES modules with ".js" extension).

The `//#ifdef TESTS` and `//#endif` block is optional, to make it easy to remove the tests in production builds using `cpp`.
