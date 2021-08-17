# Impunity, finds and runs unit tests in any imported ES module.

Do you like keeping your unit tests close to your code, with as little fanfare as possible? Does it annoy you to export things just to be able to test them? Inspired by rust's cargo, I want to write unit tests in the same file as the code they test. With this tool, you write the following in any module of your project:

```javascript
export default class SomeClass {

}

export function tests() {
	return {
		test_a(assert) {
			assert(new SomeClass().a, undefined);
		}
	}
}
```
A test function receives [the nodejs assert module](https://nodejs.org/api/assert.html) so you don't need to import it.

After installing with `npm install --global impunity`, you run the tests with `impunity --entry-point your/main.js` (use `--force-esm-dirs src/` if you use ES modules with ".js" extension) and it will discover all the tests in any file (indirectly) imported from your entry point, and run them:

```
(node:2031) ExperimentalWarning: The ESM module loader is experimental.
 * subpath::filename::test_a ... ok
```

`impunity` looks for an exported function called `tests` (you can choose another name to look for with the `--symbol ...` flag).

To remove the tests from a production build, [Rollup](https://rollupjs.org/) does a good job of removing unused code automatically during bundling.

## Typescript

impunity uses `esbuild-node-loader` to transform source files, including typescript files.