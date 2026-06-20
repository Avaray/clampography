# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased / 2.0.1-rc]

This release introduces major architectural refactoring, the separation of concerns into distinct modules, and a powerful local development environment. 

### ✨ Major Features
- **Modular Architecture**: Split the plugin into specific configurable modules (`base`, `extra`, `forms`, `kbd`, `scrollbar`, `highlights`).
- **Interactive Dev Server**: Created a fully featured local playground (`dev/index.html` & `dev/server.js`) with hot theme switching, font carousels, nested list stress tests, and keyboard shortcuts.
- **Massive Theme Expansion**: Added over 40+ built-in themes including modern, brutalist, and specialized categories (like retrowave/vaporwave neon and pastel variations).
- **OKLCH Color Space**: Migrated all theme colors to the `oklch()` color space for a wider color gamut and highly predictable lightness/chroma rendering.
- **Themed Scrollbars Module**: Added `scrollbar.js` to automatically colorize browser scrollbars using the native `scrollbar-color` CSS property while preserving OS thickness.
- **Highlights & Micro-interactions Module**: Added `highlights.js` for styling text `::selection`, `<mark>` tags, and `:target` URL jump animations.

### 🧩 Forms Module Overhaul
- **Fluid Padding**: Replaced hardcoded margins/paddings with fluid spacing tokens (`var(--clampography-spacing-xs)`, etc.).
- **Global Shape Variables**: Added `--clampography-radius` (default `0.4em`) and `--clampography-border-width` (default `1px`) to `:root` to allow easy global overrides of form shapes (e.g., brutalist sharp corners).
- **Select Arrow**: Replaced hardcoded grey SVG data URI with a CSS-only `linear-gradient` chevron that adapts to the current theme text color.
- **Accessibility & UX**: 
  - Migrated from `:focus` to `:focus-visible` to prevent annoying mouse-click focus rings.
  - Added support for JS-driven `[aria-invalid="true"]` alongside `:user-invalid`.
- **WebKit Fixes**: Added proper resets for `::-webkit-color-swatch-wrapper` in `type="color"` inputs to prevent double borders. Correctly excluded `type="hidden"`, `type="submit"`, and `type="file"` from text input styling.

### 📐 Typography & Base Refactoring
- **Fluid Spacing System**: Solidified spacing tokens (`--clampography-spacing-xs` to `xl`) and list indentations.
- **Nested Lists**: Fixed alignment and nesting issues for multi-digit `<ol>` markers. Completely rewrote list styling using flexbox and logical margins to allow 6-levels deep nesting without layout breakage.
- **Margin Collapse**: Fixed layout breaks and margin collapses in prose content wrappers.

### 🛠 Configuration & DX
- **Scope Customization**: Added support for custom root scoping (e.g., changing `:root` to a specific class).
- **Prefixing**: Added support for generating Tailwind color utilities (`bg-clampography-primary`, `text-clampography-muted`).
- **State Management**: Added localStorage persistence for the Dev Server (saves active themes and toggles).
- **Documentation**: Heavily expanded `docs/usage.md` and added `docs/configuration-flow.md` with Mermaid architecture diagrams.
