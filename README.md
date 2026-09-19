# FSL parser support

This repository contains the Tree-sitter grammar used to recognize `.fsl` files in
editor integrations. It complements `fslc-lsp`; it does not implement the language
server itself.

## Development

```bash
npm install
npm run build
npm test
```

The tests use Hegel to generate valid FSL token programs and invalid mutations. The
default seed is `1709`, with 100 cases per property. Increase the bounded case count
for exploratory runs:

```bash
HEGEL_CASES=5000 npm test
```
