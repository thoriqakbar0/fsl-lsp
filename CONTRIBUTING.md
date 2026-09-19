# Contributing

Thanks for helping make FSL available in more editors.

## Set up the project

Use Node.js 22 or newer and install the locked dependencies:

```bash
npm ci
```

For Zed extension work, install Rust and the `wasm32-wasip2` target. You also
need the compiler and Python installation required by `node-gyp`.

## Make a change

1. Update the smallest source that owns the behavior.
2. When `grammar.js` changes, run `npm run build` and commit regenerated files
   under `src/`.
3. Add or update tests for observable parser behavior.
4. Run `npm run check`, `npm test`, and, for extension changes,
   `cargo check --target wasm32-wasip2`.

Generated properties are preferred when behavior varies over a meaningful
input space. Keep focused regression examples when they document a specific
failure more clearly.

## Open a pull request

Describe the FSL syntax or editor behavior being changed, include representative
input, and call out intentional parser recovery. Keep unrelated refactors out
of the change. By contributing, you agree that your contribution is licensed
under Apache-2.0.

Please follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) in project spaces.
