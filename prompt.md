# Role

Act as an expert Full-Stack Developer and Library Author specializing in
Tailwind CSS ecosystem.

# Objective

Create a lightweight NPM package named `clampography`. This is a **Tailwind CSS
v4 plugin** designed to manage theming via CSS variables and `data-theme`
attributes. The architecture should be heavily inspired by **daisyUI v5**.

# Project Context

- **Target:** Tailwind CSS v4 (latest version).
- **Environment:** The package will be consumed by generators like Astro,
  SvelteKit, and Next.js.
- **Usage:** Users install the package and configure it. The plugin
  automatically generates the necessary CSS variables for light/dark modes based
  on settings.

# Core Requirements

### 1. The 5-Color Palette Constraint

Every theme must be defined using **strictly** these 5 CSS variables. Do not add
others.

- `--clampography-background`
- `--clampography-text`
- `--clampography-link`
- `--clampography-primary`
- `--clampography-secondary`

### 2. Configuration Logic (daisyUI v5 style)

The plugin must accept a configuration object with the following properties:

- `themes`: An array of theme names to include (e.g.,
  `["light", "dark", "aqua"]`).
  - Support special keyword `"all"` (loads all built-in themes).
  - Support special keyword `"false"` (disables defaults, only allows custom).
- `defaultTheme`: String. The theme applied to `:root` or `html` when no data
  attribute is present.
- `prefersDark`: Boolean or String. If set, automatically applies a dark theme
  when `@media (prefers-color-scheme: dark)` is true.

### 3. Implementation Details

- The plugin works by injecting CSS variables scoped to `[data-theme="name"]`
  selectors.
- It must be compatible with Tailwind v4's new plugin architecture.
- Ensure colors are defined in a way that supports Tailwind opacity modifiers
  (e.g., using `oklch` or `rgb` values if necessary for v4 syntax).

# Deliverables

Generate **only** the essential files for a valid NPM package. Do not create
unnecessary boilerplate.

1. **`package.json`**
   - Name: `clampography`
   - Peer Dependencies: `tailwindcss` (>=4.0.0)
   - Type: `module` (ESM)

2. **`src/themes.js`**
   - A dictionary object containing at least 4 example themes (e.g., `light`,
     `dark`, `retro`, `cyberpunk`).
   - Each theme must map values to the 5 specific variables listed above.

3. **`src/index.js`**
   - The main entry point using the Tailwind plugin API.
   - Logic to parse the configuration (themes, default, prefersDark).
   - Logic to generate the CSS `@layer base` styles for `:root` and
     `[data-theme]`.

# Instructions

- Read any attached documentation or files provided in the context to understand
  the styling patterns.
- Focus on clean, maintainable code.
- Output the code for these files clearly.
