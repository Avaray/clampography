# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-06-20
- **Core:** Added global `--clampography-radius` and `--clampography-border-width` CSS variables to `:root` to allow easy overriding of form element shapes (e.g., sharp corners).
- **Forms:** Refactored module to use fluid spacing tokens for button gaps.
- **Forms:** Replaced `:focus` with `:focus-visible` for better accessibility and added support for `[aria-invalid]` states.
- **Forms:** Resolved CSS conflicts with hidden/submit inputs and fixed `<select>` chevron rendering.
- **Scrollbar:** Added a new opt-in `scrollbar` module for natively theming browser scrollbars using `scrollbar-color`.
- **Highlights:** Added a new opt-in `highlights` module for styling text selection, target elements, and `<mark>` tags.
- **Dev Server:** Added scrollbar and highlight toggles, fixed input typing bugs, updated startup logs, and required the `Ctrl` modifier for keyboard shortcuts to prevent collisions.
- **Docs:** Restored features section in the README and updated browser support documentation.

## [2.0.1]
- **Build:** Removed `package.json` import statement from the source code to support browser bundlers like Tailwind Play.

## [2.0.0]
- **CI/CD:** Updated publish workflow to trigger only on the `main` branch.
- **Docs:** Completely rewrote the `README.md` with a simplified structure, comparison tables, and default values for all configuration options.
- **Cleanup:** Removed legacy `temp/` development directory.

## [2.0.0-beta.31]
- **Types:** Fixed TypeScript type definitions to use `ReturnType` for `withOptions` plugins.
- **Dependencies:** Updated Tailwind CSS v4 types import path.

## [2.0.0-beta.30]
- **Build:** Added automated TS types generation for CSS variables in the build pipeline.
- **Core:** Prepended `--clampography-` prefix to all spacing and font variables to prevent namespace collisions.
- **Core:** Added `scaleMode` option for Container Query-based fluid typography.
- **Core:** Renamed fluid bound variables to `--clampography-fluid-min` and `-max` for consistency.
- **Testing:** Introduced a comprehensive automated test suite using Bun for all modules, covering `scaleMode` edge cases.

## [2.0.0-beta.29]
- **Dependencies:** Bumped Tailwind devDependencies to `4.3.1`.
- **Core:** Converted physical CSS properties to logical properties (e.g., `margin-inline-start`) to support RTL languages.
- **Dev Server:** Massively improved the theme editor with live reactivity, throttled color updates via RAF batching, contrast calculators, and full keyboard shortcuts (Clone, Save, Delete).
- **Dev Server:** Replaced plain arrays with Vue 3 reactive refs for reliable state updates.
- **Dev Server:** Added automatic `color-scheme` detection based on background luminance.
- **Build:** Added a script to export Figma design tokens in the W3C DTCG format.
- **Themes:** Expanded the built-in library with large batches of new themes (including Bubbles, Synthwave, and Web 2.0 variations).

## [2.0.0-beta.28]
- **Themes:** Split themes into `official` and experimental `dev` sets.
- **Dev Server:** Added full CRUD capabilities for the local theme editor with Ctrl+Click color copying.
- **Core:** Introduced a typography scope isolation option to apply styles only to specific sections.
- **Core:** Implemented an Advanced Fluid Math Engine for dynamic `clamp()` generation.
- **Accessibility:** Added print optimization module, smooth theme transitions, `prefers-reduced-motion`, and `prefers-contrast` support.

## [2.0.0-beta.27]
- **Typography:** Added individual CSS custom property tokens for heading sizes, allowing separate scale adjustments.
- **Typography:** Calibrated heading typography sizes to match modern 2026 web standards.
- **Core:** Scoped base typography rules to `body` instead of universal selectors to prevent global layout disruption.
- **Core:** Lowered specificity of root variables to `:where(:root)` to easily allow user overrides without source order conflicts.
- **Docs:** Added a guide on customizing and scaling heading sizes.

## [2.0.0-beta.26]
- **Performance:** Enabled comprehensive tree-shaking support for optimized builds.
- **Forms:** Completely refactored `<progress>` and `<meter>` elements across WebKit and Firefox, unifying their sizes, tracks, and colors.
- **Core:** Adjusted padding and margin scaling across all components for better fluidity.
- **Kbd:** Enlarged `<kbd>` element minimum width to make single-character keys perfectly square.
- **Dev Server:** Replaced the legacy CSS workflow with a modernized Vue-based sidebar featuring dynamic form state toggles.

## [2.0.0-beta.25]
- **Build:** Set up a CDN distribution build pipeline.
- **Docs:** Consolidated CDN installation instructions into the usage documentation.
- **CI/CD:** Refactored the GitHub Actions publish workflow to include NPM provenance and smart version checking.

## [2.0.0-beta.24]
- **Docs:** Added new forms features documentation and fixed legacy usage examples.
- **CI/CD:** Replaced the `semver` node dependency with bash string extraction for more reliable prerelease tag detection.

## [2.0.0-beta.23]
- **Modules:** Massive release introducing the `forms` and `kbd` modules.
- **Dev Server:** Created the local Typography Playground with interactive carousels, nested list stress tests, and hot-swappable CSS variants.
- **Themes:** Migrated all theme colors to the `OKLCH` color space for wider gamut and better accessibility.
- **Typography:** Replaced absolute-positioned list counters with flexbox to resolve multi-digit alignment issues.
- **Dev Server:** Added persistent `localStorage` support.

## [2.0.0-beta.2 to 2.0.0-beta.22]
- Iterated over the core layout, `oklch()` color generation, prefix logic, and the JS-to-CSS builder.
- Implemented custom root scoping capabilities.
- Consolidated `extra` styles for blockquotes, inline code, and zebra-striped tables.
- Provided Tailwind color utility integrations.
