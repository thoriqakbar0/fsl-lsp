# FSL for Zed

> [!WARNING]
> **This is my pre-alpha, experimental FSL editor and language-server work.**
> I am building it to solve my own need for usable FSL support and sharing it
> early because I want FSL to be available to more people. The grammar is
> incomplete, the LSP is still being built, and everything may change. Expect
> missing features, incorrect highlighting, and breaking changes.

This repository is an early Zed extension, Tree-sitter grammar, and integration
home for my FSL language server. It works with
[FSL](https://github.com/ymm-oss/fsl), the AI-native formal specification
language and bounded model checker.

The project currently recognizes `.fsl` files, provides syntax highlighting and
editor rules in Zed, and starts `fslc-lsp` when that executable is available on
your `PATH`. I am building my own FSL language server here alongside the editor
integration; semantic features remain work in progress.

## Try the Zed extension locally

1. Install or build `fslc-lsp` and make sure `fslc-lsp` is on your `PATH`.
2. Clone and build this repository:

   ```bash
   git clone https://github.com/thoriqakbar0/fsl-lsp.git
   cd fsl-lsp
   npm ci
   npm run build
   cargo build --target wasm32-wasip2 --release
   ```

3. In Zed, run **zed: install dev extension**, then select this repository.

The extension can still provide FSL syntax support when the language-server
binary is unavailable, but language-server features will report that
`fslc-lsp` is missing.

## Use the parser

After `npm run build`, load the local Node.js binding with Tree-sitter:

```js
const Parser = require("tree-sitter");
const Fsl = require("./bindings/node");

const parser = new Parser();
parser.setLanguage(Fsl);

const tree = parser.parse('@spec { owner: "team"; }');
console.log(tree.rootNode.toString());
```

The root node is `source_file`. See [`src/node-types.json`](src/node-types.json)
for the generated node contract and [`grammar.js`](grammar.js) for its source.

## Development

Requirements:

- Node.js 22 or newer
- Rust with the `wasm32-wasip2` target for the Zed extension
- the compiler and Python installation required by `node-gyp`

Run the complete local checks:

```bash
npm ci
npm run check
npm test
cargo check --target wasm32-wasip2
```

The tests use Hegel to generate valid FSL token programs and invalid mutations.
The default seed is `1709`, with 100 cases per property. Increase the bounded
case count for exploratory runs:

```bash
HEGEL_CASES=5000 npm test
```

Generated parser artifacts under `src/` are committed so editor integrations
can consume the grammar without running the generator. Include regenerated
artifacts whenever `grammar.js` changes.

## Project status and direction

The short-term goal is practical FSL authoring in Zed: correct parsing and
highlighting first, followed by diagnostics, navigation, completion, and other
language-server features. The upstream language and model checker live in the
[FSL repository](https://github.com/ymm-oss/fsl).

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report
security-sensitive problems privately as described in
[SECURITY.md](SECURITY.md).

## License

Licensed under the [Apache License 2.0](LICENSE).
