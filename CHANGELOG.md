# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - Unreleased

### Breaking Changes

- **Tailwind CSS v4 Plugin Architecture**: The project has been fully migrated to use the native Tailwind CSS v4 plugin system (`@plugin "clampography"`). Previous initialization methods are no longer supported.
- **Color System Migration**: All theme colors have been migrated to the `oklch()` color space for better interpolation, accessibility, and modern browser support. Hex and RGB values are no longer used for built-in themes.
- **Decoupled Typography & Colors**: Typography base styles and layout structures no longer inject colors automatically. The base typography loads fluid, responsive features only. To use colors, the `themes` option must be explicitly configured.

### Features

- **Modular Configuration Options**: The plugin now accepts fine-grained configuration for loading specific feature sets:
  - `forms`: Full visual form styling (`forms: true`).
  - `kbd`: 3D isometric keyboard key styling on `<kbd>` elements.
  - `base` & `extra`: Granular control over the typography base styles and enhanced decorations.
- **Scoped Theming**: Added the `root` configuration option to scope theme variables to specific selectors (e.g., `#app` instead of `:root`).
- **Utility Prefixing**: Introduced the `prefix` option to namespace generated utility classes (e.g., `bg-clampography-primary`), preventing collisions with other tailwind utilities.
- **Theme Support**: Includes robust support for configuring themes (defaulting to light and dark modes) alongside options to inject custom OKLCH-based palettes via `@plugin "clampography/theme"`.
