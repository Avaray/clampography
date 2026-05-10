# Contributing to Clampography

Welcome to Clampography! This document outlines how to set up the project locally, run tests, compile CSS, and contribute to the plugin.

## Requirements

The project uses [Bun](https://bun.sh/) as the package manager and test runner.

- **Bun**: >= 1.0.0
- **Tailwind CSS**: >= 4.0.0 (Peer dependency)

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Avaray/clampography.git
   cd clampography
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Link locally (Optional):**
   If you want to test the plugin locally in another project, you can use the `file:` protocol in your host project's `package.json`:
   ```json
   "dependencies": {
     "clampography": "file:../path/to/clampography"
   }
   ```
   *Note: When using Vite, remember to add `clampography` to `server.watch.additional` so HMR triggers on local package updates.*

## Compiling CSS

The standalone CSS files in `src/css/` are not committed to Git but are generated dynamically from the core JS modules. They are included when the package is published to NPM.

To generate the `.css` and minified `.css.min` files locally:

```bash
bun run build
```

This runs `src/convert.js`, which parses `base.js` and `extra.js` into standard CSS files.

## Testing

Clampography uses `bun:test` for unit testing. Tests ensure that the Tailwind plugin loads correctly and that the CSS configuration modules export valid objects.

To run the test suite:

```bash
bun test
```

For watch mode during active development:

```bash
bun test --watch
```

## Making Changes

1. **JS Source Files:** Most style definitions live in `src/base.js`, `src/extra.js`, and `src/themes.js`. 
2. **Themes:** Ensure any new color references use the `oklch` color space format for maximum compatibility and opacity modifier support.
3. **Docs:** If you add a new feature, document it in `docs/usage.md`.
4. **Commits:** Use Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

Thank you for contributing!
