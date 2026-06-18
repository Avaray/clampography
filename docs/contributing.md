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

The standalone CSS files in `css/` are not committed to Git but are generated dynamically from the core JS modules. They are included when the package is published to NPM.

To generate the `.css` and minified `.css.min` files locally:

```bash
bun run build
```

This runs `src/convert.js`, which processes all style modules (`base.js`, `extra.js`, `forms.js`, `kbd.js`, `print.js`) into standard CSS files in the `css/` directory. It also runs `src/export-figma.js` to regenerate `css/figma-tokens.json` with the latest theme color data.

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

1. **JS Source Files:** Style definitions are split across `src/base.js`, `src/extra.js`, `src/forms.js`, `src/kbd.js`, `src/print.js`, `src/theme.js`, and `src/themes.js`. Build scripts are in `src/convert.js` and `src/export-figma.js`.
   - `base.js` — fluid typography, spacing, headings, lists, code blocks (purely structural — no colors or imposed appearance)
   - `extra.js` — opinionated decorations (colors, borders, blockquote, table zebra-stripes, links, smooth theme transitions, `prefers-reduced-motion`, `prefers-contrast: more`)
   - `forms.js` — all HTML form elements (inputs, buttons, select, checkbox, range, etc.)
   - `kbd.js` — 3D isometric keyboard key styling for `<kbd>` elements
   - `print.js` — opt-in `@media print` optimization (static sizes, ink-safe colors, page-break rules)
   - `theme.js` — structure for CSS color variables using current active theme values
   - `themes.js` — 90+ built-in color palettes using OKLCH format
   - `convert.js` — build script that converts all JS style modules to CSS and minified CSS
   - `export-figma.js` — build script that generates `css/figma-tokens.json` from all themes
2. **Themes:** Ensure any new color references use the `oklch` color space format for maximum compatibility and opacity modifier support.
3. **Docs:** If you add a new feature, document it in `docs/usage.md`.
4. **Commits:** Use Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

Thank you for contributing!
