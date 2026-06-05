# Clampography Usage Guide

Complete guide from basic setup to advanced theming scenarios.

---

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Custom Fonts](#custom-fonts)
- [Customizing Headings](#customizing-headings)
  - [Adjusting Fluid Bounds (Min / Max)](#adjusting-fluid-bounds-min--max)
  - [Global Scaling](#global-scaling)
  - [Individual Heading Scaling](#individual-heading-scaling)
  - [Completely Custom Sizes](#completely-custom-sizes)
- [Advanced Fluid Math](#advanced-fluid-math)
- [Scope Isolation (Prose Mode)](#scope-isolation-prose-mode)
- [Configuration Options](#configuration-options)
- [Built-in Themes](#built-in-themes)
- [Custom Themes](#custom-themes)
- [Scoped Themes (Custom Root)](#scoped-themes-custom-root)
- [Advanced Scenarios](#advanced-scenarios)
- [Print Optimization](#print-optimization)
- [Accessibility & Theme Transitions](#accessibility--theme-transitions)
- [Figma Design Tokens](#figma-design-tokens)
- [Form Styles](#form-styles)
- [Tailwind Utilities](#tailwind-utilities)
- [Color Formats](#color-formats)
- [Opacity Modifiers](#opacity-modifiers)
- [Troubleshooting](#troubleshooting)

---

## Installation

### Via Package Manager (Tailwind Plugin)

```bash
# Install with NPM
npm install clampography

# Install with PNPM
pnpm add clampography

# Install with Bun
bun install clampography

# Install with Deno
deno install npm:clampography
```

### Via CDN (Vanilla CSS)

If you aren't using Tailwind CSS, you can drop the pre-built stylesheet into your HTML to get all base typography, extra styles, forms, and keyboard key styling instantly.

This approach gives you production-ready, fluid typography without the need for Node.js, Bun, or any build tools.

#### Option 1: All-in-One (Recommended)

This includes `base`, `extra`, `forms`, and `kbd` in a single file.

```html
<link rel="stylesheet" href="https://unpkg.com/clampography/css/clampography.min.css" />
<!-- or -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/clampography/css/clampography.min.css" />
```

#### Option 2: Modular

If you only want specific modules, you can load them individually. Note that `base.min.css` is required for the fluid typography to work.

```html
<!-- Required: Fluid typography, spacing, structural base -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/base.min.css" />

<!-- Required for Colors: Injects default light/dark themes (needed by extra & forms) -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/theme.min.css" />

<!-- Optional additions -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/extra.min.css" />
<link rel="stylesheet" href="https://unpkg.com/clampography/css/forms.min.css" />
<link rel="stylesheet" href="https://unpkg.com/clampography/css/kbd.min.css" />
```

#### Version Pinning

In production, it's highly recommended to pin the version to avoid unexpected breaking changes:

```html
<link rel="stylesheet" href="https://unpkg.com/clampography@2.0.0/css/clampography.min.css" />
```

---

## Basic Usage

### Minimal Setup (No Themes)

Load only typography and spacing styles without any colors.

```css
@import "tailwindcss";
@plugin "clampography";
```

**Result:**

- ✅ Typography styles (headings, paragraphs, lists)
- ✅ Fluid spacing system
- ✅ Structural base styles
- ❌ No colors loaded

**Use case:** When you want to use your own color system but need the
typography.

### Basic Setup with Colors

Load default light/dark themes that respect system preferences.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
}
```

**Result:**

```css
/* Light theme by default (lower specificity with :where) */
:where(:root),
[data-theme="light"] {
  --clampography-background: oklch(100% 0 0);
  --clampography-primary: oklch(63% 0.258 262);
  /* ... all other colors */
}

/* Dark theme for dark mode users */
@media (prefers-color-scheme: dark) {
  :root {
    --clampography-background: oklch(10% 0 0);
    --clampography-primary: oklch(63% 0.258 262);
    /* ... all other colors */
  }
}

/* Other themes available for manual switching */
[data-theme="dark"] {
  /* ... */
}
```

**Use case:** Most common setup. Automatic light/dark switching + manual theme
picker.

**Note:** When using `themes: all`, the plugin automatically:

- Sets `light` as default (if available)
- Sets `dark` for `prefers-color-scheme: dark` (if available)
- If light theme doesn't exist, uses the first available theme as default

### With Extra Opinionated Styles

Add colored borders, backgrounds, and enhanced styling.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  base: true; /* default: true */
  extra: true; /* default: false */
}
```

**Result:**

- ✅ All base styles
- ✅ Colored elements (tables, code blocks, blockquotes)
- ✅ Styled links, list markers, inline code
- ✅ Zebra-striped tables
- ❌ No styled form elements (use `forms: true` for that)

**Use case:** When you need a fully colored document, but manage form styling yourself.

### With Styled Forms (Optional)

Add themed, ready-to-use form elements.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  extra: true;
  forms: true; /* default: false */
}
```

**Result:**

- ✅ All base and extra styles
- ✅ Styled inputs, textareas, and selects (with readonly and user-invalid states)
- ✅ Styled buttons (default and primary variant)
- ✅ Checkbox, radio, range, color picker with `accent-color` and custom focus rings
- ✅ Themed fieldset, legend, label
- ✅ WebKit specific resets for search and number inputs

**Use case:** When you want a complete, ready-to-use design system including forms.

### With Styled Keyboard Keys (Optional)

Style `<kbd>` elements as realistic 3D keyboard keys.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  kbd: true; /* default: false */
}
```

**Result:**

- ✅ `<kbd>` elements rendered with a 3D isometric key effect
- ✅ Layered `box-shadow` simulates key depth and cast shadow
- ✅ Inset highlight on the key face
- ✅ `:active` state — key visually travels down when pressed
- ✅ Adapts to any theme via `--clampography-*` variables

**Use case:** Documentation, tutorials, or any content that references keyboard shortcuts.

---

## Custom Fonts

Clampography intelligently integrates with Tailwind CSS to automatically respect your font choices. It does not force its own typography on your site if you have explicitly defined your own.

If no custom font is provided, it safely falls back to a highly optimized, premium local system font stack (prioritizing modern fonts like Inter, San Francisco, and Segoe UI Variable Display).

### Global Custom Font

To define a custom font for your entire project (which Clampography will automatically adopt for all body text), override the `--font-sans` variable in your CSS using the `@theme` directive:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import "tailwindcss";
@plugin "clampography";

@theme {
  --font-sans: "Inter", sans-serif;
  --font-mono: "Your Custom Mono", monospace;
}
```

### Lazy Loading Fonts per Theme

You can bind specific web fonts to specific themes. Modern browsers are incredibly smart—they will **only** download the font file when an HTML element actually requires it.

By scoping your `--font-sans` variable to a specific theme selector, you guarantee that a font is only downloaded over the network when the user switches to that exact theme!

```css
/* 1. Import all potential web fonts at the top */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&display=swap');

@import "tailwindcss";
@plugin "clampography";

/* 2. Set the default font (Inter is downloaded immediately) */
:where(:root) {
  --font-sans: 'Inter', sans-serif;
}

/* 3. Set the font for a specific theme. 
      Oswald will ONLY be downloaded when <html data-theme="vintage"> is active! */
[data-theme="vintage"] {
  --font-sans: 'Oswald', sans-serif;
}
```

Clampography internally uses the CSS cascade `var(--font-sans, var(--font-family-base))`. This ensures your Tailwind fonts always take priority dynamically, while falling back to a robust system font stack if needed.

---

## Customizing Headings

Clampography provides beautiful fluid typography defaults (using `clamp()`), but gives you absolute control over heading sizes through zero-specificity CSS variables. You can tweak just the minimum or maximum size, proportionally scale all headings at once, or replace the entire fluid formula for any heading.

### Adjusting Fluid Bounds (Min / Max)

Every heading exposes its fluid bounds as plain **unitless rem values** that you can override directly in CSS:

| Variable | Default | Description |
|---|---|---|
| `--clampography-h1-min` | `1.875` | H1 minimum size (mobile) |
| `--clampography-h1-max` | `4` | H1 maximum size (large screen) |
| `--clampography-h2-min` | `1.25` | H2 minimum size |
| `--clampography-h2-max` | `3` | H2 maximum size |
| `--clampography-h3-min` | `1.125` | H3 minimum size |
| `--clampography-h3-max` | `2.25` | H3 maximum size |
| `--clampography-h4-min` | `1` | H4 minimum size |
| `--clampography-h4-max` | `1.5` | H4 maximum size |
| `--clampography-h5-min` | `1` | H5 size (static by default) |
| `--clampography-h5-max` | `1` | H5 max — set different from min to make it fluid |
| `--clampography-h6-min` | `0.875` | H6 size (static by default) |
| `--clampography-h6-max` | `0.875` | H6 max — set different from min to make it fluid |

The `slope` and `base` for the linear interpolation are computed automatically using CSS `calc()` — you only need to touch `--min` and/or `--max`.

```css
@layer base {
  :root {
    /* Reduce H1 max size on large screens (from 4rem → 3rem) */
    --clampography-h1-max: 3;

    /* Reduce all headings on large screens */
    --clampography-h2-max: 2.25;
    --clampography-h3-max: 1.75;

    /* Increase H1 minimum on small screens (from 1.875rem → 2.25rem) */
    --clampography-h1-min: 2.25;

    /* Make H5 fluid (it's static by default) */
    --clampography-h5-max: 1.25;
  }
}
```

> [!NOTE]
> Values are **unitless rem multipliers** (not `rem`, not `px`). Write `3` to mean `3rem`.

You can also override the viewport bounds that all headings use for interpolation:

```css
@layer base {
  :root {
    /* Change the fluid engine viewport range */
    /* These are set automatically from plugin options (fluid-min / fluid-max) */
    /* but can be overridden in CSS if needed */
    --clampography-v-min: 23.4375; /* 375px / 16 */
    --clampography-v-max: 90;      /* 1440px / 16 */
  }
}
```

### Global Scaling

You can proportionally scale all headings (H1-H6) globally by overriding the `--clampography-heading-scale` multiplier on `:root`. By default, this multiplier is `1`.

```css
@layer base {
  :root {
    /* Shrinks all headings to 85% of their default fluid sizes */
    --clampography-heading-scale: 0.85;
  }
}
```

### Individual Heading Scaling

If you want to scale a specific heading without affecting others, you can use the individual scale variables (e.g. `--clampography-h1-scale` through `--clampography-h6-scale`). These default to inheriting the global scale.

```css
@layer base {
  :root {
    /* Scale all headings down slightly... */
    --clampography-heading-scale: 0.85;

    /* ...except for H1, which we want much larger */
    --clampography-h1-scale: 1.25;
  }
}
```

### Completely Custom Sizes

If you don't like the default fluid `clamp()` math provided by the plugin, you can replace the entire size definition for any heading.

```css
@layer base {
  :root {
    /* Provide a completely custom clamp() function */
    --clampography-h1-size: clamp(2.5rem, 5vw, 5rem);

    /* Or provide a fixed static size */
    --clampography-h2-size: 3rem;
  }
}
```

Because Clampography uses `:where(:root)` internally for these variables, your `@layer base` overrides will **always** win regardless of CSS file loading order. No `!important` required!

---

## Advanced Fluid Math

Clampography features a built-in mathematical engine that calculates perfectly smooth `clamp()` functions for all typography and spacing elements.

Instead of hardcoding sizes to specific breakpoints (which breaks if your site is wider or narrower than standard), you can configure the exact viewport range across which all typography should fluidly scale.

### Configuring Fluid Bounds

By default, Clampography scales everything between **320px** (mobile) and **1280px** (desktop). To change this, pass `fluid-min` and `fluid-max` options:

```css
@plugin "clampography" {
  themes: all;
  
  /* Start scaling at a custom mobile breakpoint */
  fluid-min: "375px";
  
  /* Keep scaling all the way up to ultra-wide desktop */
  fluid-max: "1536px";
}
```

When you change these bounds, **all** font sizes, margins, and padding variables in `base.js` will automatically mathematically stretch to fit your new bounds perfectly, ensuring a flawless linear scale.

### Tailwind Typography Alignment

Clampography's fluid sizes are mathematically audited to perfectly match the official `@tailwindcss/typography` plugin at the minimum and maximum boundaries:

- `body`: 14px ➔ 18px (`sm` to `2xl` equivalents)
- `h1`: 30px ➔ 64px
- `h2`: 20px ➔ 48px
- `h3`: 18px ➔ 36px
- `h4`: 16px ➔ 24px

---

## Scope Isolation (Prose Mode)

By default, Clampography styles elements like `h1`, `p`, `ul`, `table`, and `blockquote` globally. This is perfect for content-heavy sites (like blogs), but can interfere with UI elements in complex applications (like dashboards).

You can isolate Clampography's styling to a specific class using the `typography` option:

```css
@plugin "clampography" {
  themes: all;
  typography: ".clampography"; /* Only style elements inside this class */
}
```

**Usage in HTML:**

```html
<!-- NOT STYLED: Plain Tailwind CSS -->
<nav class="sidebar">
  <h1>Dashboard Menu</h1>
</nav>

<!-- STYLED: Beautiful fluid typography and themes -->
<main class="clampography">
  <h1>Article Title</h1>
  <p>This text is fluid and perfectly spaced.</p>
</main>
```

> [!NOTE]  
> Clampography variables (like `--clampography-primary` or `--clampography-h1-size`) remain globally accessible on `:root`, meaning you can still use utility classes like `bg-clampography-primary` anywhere on the page, even outside the isolated scope!

---

## Configuration Options

### Main Plugin Options

```css
@plugin "clampography" {
  /* Load built-in themes */
  themes: "all" | "light, dark" | false;
  
  /* Load base typography styles */
  base: true | false; /* default: true */
  
  /* Load extra opinionated styles (colors, decorations, transitions) */
  extra: true | false; /* default: false */

  /* Load styled form elements (inputs, buttons, selects, etc.) */
  forms: true | false; /* default: false */

  /* Style <kbd> elements as 3D isometric keyboard keys */
  kbd: true | false; /* default: false */

  /* Load print optimization styles (@media print) */
  print: true | false; /* default: false */
  
  /* Custom root selector for CSS variables scoping */
  root: ":root" | "#app" | "body"; /* default: ":root" */
  
  /* Typography scope isolation (apply styles only to a specific class) */
  typography: "global" | ".clampography" | ".prose"; /* default: "global" */
  
  /* Customize utility class prefix */
  prefix: "clampography" | "custom" | false; /* default: "clampography" */
  
  /* Advanced: Custom viewport scaling bounds for fluid math engine */
  fluid-min: "320px"; /* default: "320" */
  fluid-max: "1280px"; /* default: "1280" */

  /* Enable/disable console logs */
  logs: true | false; /* default: true */
}
```

### Custom Theme Options

```css
@plugin "clampography/theme" {
  /* Required: Theme name */
  name: "brand";
  
  /* Set as default theme */
  default: true | false; /* default: false */
  
  /* Use for prefers-color-scheme: dark */
  prefersdark: true | false; /* default: false */
  
  /* Fallback theme for missing colors */
  color-scheme: "light" | "dark"; /* default: "light" */
  
  /* Custom root selector */
  root: ":root" | "#widget"; /* default: ":root" */
  
  /* Enable/disable logs for this theme */
  logs: true | false; /* default: true */
  
  /* Color definitions */
  primary: "oklch(...)";
  background: "oklch(...)";
  /* ... etc */
}
```

### Prefix Option

Control the prefix for Tailwind utility classes.

**Default behavior (prefix enabled):**

```css
@plugin "clampography" {
  prefix: "clampography"; /* or just: prefix: true */
}
```

Utilities generated:

```html
<div class="bg-clampography-background text-clampography-text">
  <button class="bg-clampography-primary">Click</button>
</div>
```

**Custom prefix:**

```css
@plugin "clampography" {
  prefix: "theme";
}
```

Utilities generated:

```html
<div class="bg-theme-background text-theme-text">
  <button class="bg-theme-primary">Click</button>
</div>
```

**No prefix:**

```css
@plugin "clampography" {
  prefix: false;
}
```

Utilities generated:

```html
<div class="bg-background text-text">
  <button class="bg-primary">Click</button>
</div>
```

**Note:** CSS variables always keep the `--clampography-` prefix regardless of
this setting.

### Logs Option

Control console output during build.

**Default (logs enabled):**

```css
@plugin "clampography" {
  themes: all;
  logs: true; /* Shows which themes are loaded */
}
```

Console output:

```
🍀 Clampography v2.0.0 loaded successfully
🍀 Clampography: Loaded 2 built-in themes: light (default), dark (prefersdark)
```

**Disable logs:**

```css
@plugin "clampography" {
  themes: all;
  logs: false; /* Silent mode */
}
```

**Per-theme logs:**

```css
@plugin "clampography/theme" {
  name: "brand";
  logs: false; /* Don't log this specific theme */
}
```

---

## Built-in Themes

### Available Themes

- **light** - Clean light theme with blue accents
- **dark** - Modern dark theme with high contrast

### Load Specific Themes

```css
@plugin "clampography" {
  themes: "light, dark";
}
```

**Result:**

```css
/* Light as default */
:where(:root),
[data-theme="light"] {
  /* light colors */
}

/* Dark for system dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* dark colors */
  }
}

/* Dark also available for manual switching */
[data-theme="dark"] {
  /* ... */
}
```

**Important:** When using `themes: all`, the plugin automatically sets:

- `light` as default (`:where(:root)`)
- `dark` for `prefers-color-scheme: dark`
- If `light` doesn't exist, the first theme in the list becomes default
- For specific themes without flags, only `[data-theme]` selectors are generated
  (no `:root` colors).

### Customize Default Behavior

Override which theme is default and which responds to `prefers-color-scheme`.

```css
@plugin "clampography" {
  /* Using a comma-separated string: */
  themes: "dark --default, light --prefersdark";
}
```

Or using an array (if configured via `tailwind.config.js` or modern CSS config):

```js
@plugin "clampography" {
  themes: ["dark --default", "light --prefersdark"];
}
```

**Result:**

```css
/* Dark theme by default */
:where(:root),
[data-theme="dark"] {
  /* dark colors */
}

/* Light theme for users who prefer light mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* light colors */
  }
}

/* Other themes available for manual switching */
[data-theme="light"] {
  /* ... */
}
```

**Use case:** Dark-first website that respects user preferences.

### Load Themes Without Default

If you don't specify `--default` or use `themes: all`, themes are only available
via `data-theme` attribute.

```css
@plugin "clampography" {
  themes: "dark";
}
```

**Result:**

```css
/* No :root colors - only data-theme selectors */
[data-theme="dark"] {
  /* ... */
}
```

**Important:** Your page will have no colors by default until you add
`data-theme` to an element!

To fix this, explicitly set a default:

```css
@plugin "clampography" {
  themes: "dark --default";
}
```

---

## Custom Themes

### Basic Custom Theme

Create your own theme with OKLCH colors.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: false; /* Disable built-in themes */
}

@plugin "clampography/theme" {
  name: "brand";
  default: true;
  color-scheme: light;

  primary: "oklch(60% 0.25 270)"; /* Purple */
  secondary: "oklch(70% 0.20 150)"; /* Green */
  background: "oklch(99% 0.005 270)"; /* Light purple tint */
  text: "oklch(20% 0.02 270)"; /* Dark purple-gray */
}
```

**Result:**

```css
:where(:root),
[data-theme="brand"] {
  --clampography-primary: oklch(60% 0.25 270);
  --clampography-secondary: oklch(70% 0.20 150);
  --clampography-background: oklch(99% 0.005 270);
  --clampography-text: oklch(20% 0.02 270);
  /* Missing colors auto-filled from "light" theme */
  --clampography-heading: oklch(15% 0.02 264);
  --clampography-surface: oklch(96% 0.003 264);
  /* ... etc */

  color-scheme: light;
}
```

**Important:** You don't need to define all 13 colors. Missing colors are
automatically filled from the fallback theme based on `color-scheme`.

### Light + Dark Custom Themes

Create both light and dark versions of your brand.

```css
@plugin "clampography" {
  themes: false;
}

@plugin "clampography/theme" {
  name: "brand-light";
  default: true;
  color-scheme: light;

  primary: "oklch(60% 0.25 270)";
  background: "oklch(99% 0.005 270)";
  text: "oklch(20% 0.02 270)";
}

@plugin "clampography/theme" {
  name: "brand-dark";
  prefersdark: true;
  color-scheme: dark;

  primary: "oklch(70% 0.25 270)";
  background: "oklch(15% 0.02 270)";
  text: "oklch(95% 0.005 270)";
}
```

**Result:**

```css
/* Light by default */
:where(:root),
[data-theme="brand-light"] {
  /* brand-light colors */
}

/* Dark for dark mode users */
@media (prefers-color-scheme: dark) {
  :root {
    /* brand-dark colors */
  }
}

/* Dark also available for manual switching */
[data-theme="brand-dark"] {
  /* brand-dark colors */
}
```

### All 13 Available Colors

You can customize any of these colors in your theme:

```css
@plugin "clampography/theme" {
  name: "complete";

  background: "oklch(...)"; /* Page background */
  surface: "oklch(...)"; /* Cards, code blocks, elevated surfaces */
  border: "oklch(...)"; /* Borders, dividers */

  text: "oklch(...)"; /* Body text */
  heading: "oklch(...)"; /* Headings (h1-h6) */
  muted: "oklch(...)"; /* Captions, subtle text */

  primary: "oklch(...)"; /* Main brand color, buttons, links */
  secondary: "oklch(...)"; /* Accent color, highlights */
  link: "oklch(...)"; /* Link color (defaults to primary) */

  success: "oklch(...)"; /* Success messages, positive actions */
  warning: "oklch(...)"; /* Warnings, alerts */
  error: "oklch(...)"; /* Errors, destructive actions */
  info: "oklch(...)"; /* Information, hints */
}
```

### Mix Built-in + Custom Themes

Use built-in themes alongside your custom ones.

```css
@plugin "clampography" {
  themes: "light, dark";
}

@plugin "clampography/theme" {
  name: "brand";
  primary: "oklch(60% 0.25 270)";
  secondary: "oklch(70% 0.20 150)";
}
```

**Result:**

- **light** → `:where(:root),[data-theme="light"]` (default)
- **dark** → `@media (prefers-color-scheme: dark)` + `[data-theme="dark"]`
- **brand** → `[data-theme="brand"]` (manual switching only)

---

## Scoped Themes (Custom Root)

Scope theme colors to a specific element instead of `:root`. This is useful for
web components, shadow DOM, or specific sections of your page.

### Basic Scoped Theme

```css
@plugin "clampography" {
  themes: all;
  root: "#my-app";
}
```

**Result:**

```css
/* Colors scoped to #my-app */
:where(#my-app),
#my-app[data-theme="light"],
#my-app [data-theme="light"] {
  --clampography-background: oklch(100% 0 0);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  #my-app {
    --clampography-background: oklch(10% 0 0);
    /* ... */
  }
}

/* Base styles also scoped to #my-app */
#my-app {
  --spacing-xs: clamp(0.5rem, 0.375rem + 0.625vw, 0.75rem);
  font-family: var(--font-family-base);
  /* ... */
}

#my-app h1 {
  font-size: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);
  /* ... */
}
```

**Important:** Both theme colors AND base/extra styles are scoped when using
`root` option.

### Custom Theme with Custom Root

```css
@plugin "clampography" {
  themes: false;
}

@plugin "clampography/theme" {
  name: "widget";
  default: true;
  root: "#widget";
  primary: "oklch(60% 0.25 270)";
}
```

**Result:**

```css
:where(#widget),
[data-theme="widget"] {
  --clampography-primary: oklch(60% 0.25 270);
  /* ... other colors from fallback ... */
}
```

HTML:

```html
<div id="widget">
  <!-- Widget uses theme colors -->
  <button class="bg-clampography-primary">Button</button>
</div>

<div id="main-app">
  <!-- This area doesn't have theme colors -->
</div>
```

### Multiple Scoped Sections

Create different themed sections on the same page.

```css
@plugin "clampography/theme" {
  name: "header";
  default: true;
  root: "header";
  primary: "oklch(55% 0.25 240)";
}

@plugin "clampography/theme" {
  name: "sidebar";
  default: true;
  root: "aside";
  primary: "oklch(60% 0.20 140)";
}
```

**Result:**

```css
:where(header),
[data-theme="header"] {
  --clampography-primary: oklch(55% 0.25 240);
  /* ... */
}

:where(aside),
[data-theme="sidebar"] {
  --clampography-primary: oklch(60% 0.20 140);
  /* ... */
}
```

HTML:

```html
<header>
  <!-- Uses header theme (blue) -->
  <button class="bg-clampography-primary">Header Button</button>
</header>

<aside>
  <!-- Uses sidebar theme (green) -->
  <button class="bg-clampography-primary">Sidebar Button</button>
</aside>
```

---

## Advanced Scenarios

### Scenario 1: No Built-in Themes, Only Custom

Perfect for maintaining full brand control.

```css
@plugin "clampography" {
  themes: false;
  base: true;
  extra: true;
}

@plugin "clampography/theme" {
  name: "corporate";
  default: true;
  prefersdark: false;
  color-scheme: light;

  primary: "oklch(45% 0.15 220)";
  secondary: "oklch(55% 0.12 30)";
  /* Other colors auto-filled from light theme */
}
```

**What happens:**

- No built-in themes loaded
- Your `corporate` theme becomes `:where(:root),[data-theme="corporate"]`
- Missing colors filled from `light` theme
- No automatic dark mode (you define it manually if needed)

### Scenario 2: Partial Color Definition

Define only brand colors, let others fall back.

```css
@plugin "clampography/theme" {
  name: "minimal";
  default: true;
  color-scheme: light;

  primary: "oklch(55% 0.28 340)";
  /* Only 1 out of 13 colors defined! */
}
```

**Result:**

```css
:where(:root),
[data-theme="minimal"] {
  /* Your custom color */
  --clampography-primary: oklch(55% 0.28 340);

  /* Auto-filled from light theme */
  --clampography-background: oklch(100% 0 0);
  --clampography-border: oklch(92% 0.003 264);
  --clampography-error: oklch(63% 0.22 27);
  /* ... all other colors from light */
}
```

### Scenario 3: Dark Fallback for Partial Definition

```css
@plugin "clampography/theme" {
  name: "midnight";
  default: true;
  color-scheme: dark; /* Use dark as fallback! */

  primary: "oklch(75% 0.25 200)"; /* Cyan accent */
  secondary: "oklch(80% 0.25 340)"; /* Pink accent */
}
```

**Result:**

- Your 2 custom colors
- Other 11 colors filled from `dark` theme (dark backgrounds, light text)

### Scenario 4: Multiple Custom Themes with Manual Switching

Build a theme switcher for your app.

```css
@plugin "clampography" {
  themes: false;
}

@plugin "clampography/theme" {
  name: "ocean";
  default: true;
  primary: "oklch(60% 0.20 220)"; /* Blue */
}

@plugin "clampography/theme" {
  name: "forest";
  primary: "oklch(60% 0.20 140)"; /* Green */
}

@plugin "clampography/theme" {
  name: "sunset";
  primary: "oklch(65% 0.25 40)"; /* Orange */
}
```

HTML:

```html
<body data-theme="ocean">
  <!-- Ocean theme active -->
</body>

<body data-theme="forest">
  <!-- Forest theme active -->
</body>
```

JavaScript:

```javascript
// Theme switcher
const themes = ["ocean", "forest", "sunset"];
document.body.setAttribute("data-theme", themes[selectedIndex]);
```

### Scenario 5: Respect System + Manual Override

Most flexible setup for users.

```css
@plugin "clampography" {
  themes: "light, dark";
}

@plugin "clampography/theme" {
  name: "high-contrast";
  primary: "oklch(90% 0.35 270)";
  background: "oklch(5% 0 0)";
  text: "oklch(100% 0 0)";
}
```

HTML with theme switcher:

```html
<body>
  <!-- Automatically uses light/dark based on system -->
</body>

<body data-theme="high-contrast">
  <!-- User manually selected high contrast -->
</body>

<body data-theme="light">
  <!-- User forced light mode -->
</body>
```

### Scenario 6: Isolated Widget with Independent Theme

Create a widget that doesn't inherit page colors.

```css
/* Main page theme */
@plugin "clampography" {
  themes: "light, dark";
}

/* Widget with its own theme */
@plugin "clampography/theme" {
  name: "widget";
  default: true;
  root: "#chat-widget";
  color-scheme: dark;

  primary: "oklch(70% 0.25 200)";
  background: "oklch(15% 0.02 240)";
}
```

HTML:

```html
<body>
  <!-- Main page uses light/dark system theme -->
  <main class="bg-clampography-background text-clampography-text">
    <h1 class="text-clampography-heading">Page Content</h1>
  </main>

  <!-- Widget has independent theme -->
  <div id="chat-widget">
    <div class="bg-clampography-background">
      <!-- Uses widget's dark theme -->
    </div>
  </div>
</body>
```

---

## Print Optimization

Enable clean, ink-friendly output for printing or exporting to PDF. This is an **opt-in** module — it does not load automatically to keep `base.js` purely structural.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  print: true; /* default: false */
}
```

**What it does when activated:**

- Converts all fluid `vw`-based `clamp()` sizes to static `pt` units (e.g., `body` → `12pt`, `h1` → `28pt`)
- Forces `color: black` and `background: white` on `body` — saves ink regardless of which theme the user has active
- Prevents headings from sitting alone at the bottom of a page (`page-break-after: avoid`)
- Prevents code blocks, blockquotes, tables, and figures from being split across page breaks (`page-break-inside: avoid`)
- Disables all CSS transitions during printing

**Use case:** Blogs, documentation sites, articles, or any content users might print or save as PDF.

> [!TIP]
> The print module respects the `root` option, so if you use a custom root selector (e.g., `root: "#app"`), print styles will be scoped correctly to your element.

---

## Accessibility & Theme Transitions

These features are included automatically with `extra: true` — no additional configuration needed.

### Smooth Theme Transitions

When `extra: true` is enabled, Clampography adds smooth color transitions to the `body` element. When a user changes the active theme (e.g., by setting `document.body.setAttribute("data-theme", "dark")`), all colors animate elegantly instead of snapping instantly.

The transition duration is controlled by the `--clampography-transition-duration` CSS custom property (default: `200ms`). You can override it:

```css
@layer base {
  :root {
    /* Slow down to 500ms */
    --clampography-transition-duration: 500ms;

    /* Or disable entirely */
    --clampography-transition-duration: 0ms;
  }
}
```

### Reduced Motion

Clampography automatically respects the user's OS-level **"Reduce Motion"** accessibility setting (macOS, Windows, iOS, Android). When `prefers-reduced-motion: reduce` is detected, the `--clampography-transition-duration` is reset to `0ms` and all transitions are removed — no configuration required.

```css
/* This is handled automatically by extra.js */
@media (prefers-reduced-motion: reduce) {
  body {
    transition: none;
    --clampography-transition-duration: 0ms;
  }
}
```

### High Contrast Mode

When `extra: true` is enabled, Clampography also automatically responds to the **"Increase Contrast"** OS accessibility setting (`prefers-contrast: more`). This overrides all theme colors with maximum-legibility black-on-white styling:

- `body` background → `white`, color → `black`
- All headings → `black`
- Links → `black`, `font-weight: 700`, thick underline
- Code blocks, `<pre>`, `<blockquote>` → `2px solid black` borders
- Tables → `2px solid black` borders on all cells
- Horizontal rules → `2px solid black`

This is triggered automatically by macOS "Increase Contrast", Windows High Contrast Mode, or Android Accessibility settings — **no code changes required from the user**.

---

## Figma Design Tokens

Every time you run `bun run build`, Clampography automatically generates a `css/figma-tokens.json` file containing all 90+ built-in themes formatted as standard [W3C Design Tokens](https://design-tokens.github.io/community-group/format/).

### How to use in Figma

1. Install the [Tokens Studio for Figma](https://tokens.studio/) plugin
2. Open the plugin → **Sync** → **Local file** → Select `css/figma-tokens.json`
3. All Clampography themes and colors appear instantly as Figma color styles

### Token format

Each theme is a group of named color tokens:

```json
{
  "light": {
    "background": { "value": "oklch(100% 0 0)", "type": "color" },
    "primary":    { "value": "oklch(63% 0.258 262)", "type": "color" },
    "text":       { "value": "oklch(31% 0.02 257)", "type": "color" }
  },
  "dark": {
    "background": { "value": "oklch(10% 0 0)", "type": "color" },
    "primary":    { "value": "oklch(63% 0.258 262)", "type": "color" },
    "text":       { "value": "oklch(95% 0 0)", "type": "color" }
  }
}
```

> [!NOTE]
> The token file is regenerated automatically on every `bun run build`. It is included in the published NPM package inside the `css/` directory, so users can also access it directly from `node_modules/clampography/css/figma-tokens.json`.

---

## Form Styles

Enable with `forms: true` in your plugin configuration. All form elements are
themed using `--clampography-*` CSS variables, so they automatically adapt to
any active theme — both built-in and custom.

```css
@plugin "clampography" {
  themes: all;
  forms: true;
}
```

### Buttons

Default button style inherits `surface` colors and adds a `border`. A `.primary`
class (or `[type='submit']`) switches to the primary brand color.

```html
<!-- Default button -->
<button>Cancel</button>
<button type="button">Click me</button>

<!-- Primary button -->
<button type="submit">Submit</button>
<button class="primary">Save</button>
```

**States:**
- `:hover` — border transitions to `--clampography-primary`
- `.primary` / `[type='submit']` — background becomes `--clampography-primary`
- `.primary:hover` — slight `brightness(1.1)` filter lift

---

### Text Inputs, Textarea, Select

All text-accepting controls use `100%` width, padded using `--spacing-*`
variables, and share the same border + focus ring treatment.

```html
<input type="text" placeholder="Enter value" />
<input type="email" placeholder="email@example.com" />
<textarea rows="4" placeholder="Write something..."></textarea>
<select>
  <option>Option A</option>
  <option>Option B</option>
</select>
```

**States:**

| State | Effect |
|---|---|
| `:focus` | Border → `primary`, `box-shadow` glow ring (20% opacity) |
| `:disabled` | `opacity: 0.5`, `cursor: not-allowed` |
| `[readonly]` | Semi-transparent `surface` background, `cursor: default` |
| `:user-invalid` | Border → `error` color, red glow ring on focus |
| `::placeholder` | `muted` color |

**WebKit resets included:**
- `[type='search']` — removes native cancel button and decoration
- `[type='number']` — normalizes inner spin button height

---

### Select (Custom Arrow)

The `<select>` element gets a custom SVG chevron arrow and hides the native
appearance:

```html
<select>
  <option>Choose an option</option>
</select>
```

The arrow is hardcoded as a gray SVG (`stroke='%236b7280'`). You may override it
in your own CSS if you need a themed arrow.

---

### File Input

```html
<input type="file" />
```

- Background removed, border removed — only the native file button is visible
- The `::file-selector-button` pseudo-element is styled to match the default
  button look (surface color, border, border-radius)
- `:hover::file-selector-button` — same border-to-primary transition as buttons

---

### Checkbox and Radio

```html
<input type="checkbox" /> Check me
<input type="radio" name="opt" /> Option A
```

- Uses `accent-color: var(--clampography-primary)` for native tick/dot color
- `1em × 1em` dimensions, `vertical-align: middle`
- `:focus-visible` — `2px solid primary` outline with `2px` offset (keyboard-safe)

---

### Range Slider

```html
<input type="range" min="0" max="100" />
```

- Full width (`100%`)
- Track and thumb use `accent-color: var(--clampography-primary)`

---

### Color Picker

```html
<input type="color" />
```

- `2.5rem × 2.5rem` with `0.125rem` inner padding
- Themed `border` and `background`, `border-radius: 0.375rem`

---

### Fieldset and Legend

```html
<fieldset>
  <legend>Personal Info</legend>
  <input type="text" placeholder="Name" />
</fieldset>
```

- `fieldset` — `surface` background with `border` + rounded corners
- `legend` — uses `--clampography-heading` color

---

### Label

```html
<label for="name">Full Name</label>
<input id="name" type="text" />
```

- Color set to `--clampography-text`

---

### Output

```html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="range" id="a" /> +
  <input type="number" id="b" /> =
  <output name="result">0</output>
</form>
```

- Color: `--clampography-primary`
- Font weight: `600`

---

### Meter and Progress

```html
<meter value="0.7">70%</meter>
<progress value="40" max="100">40%</progress>
```

- Both use `accent-color: var(--clampography-primary)` and `width: 100%`

---

## Tailwind Utilities

### Default (With Prefix)

By default, all utilities use the `clampography-` prefix:

```html
<!-- Backgrounds -->
<div class="bg-clampography-background">...</div>
<div class="bg-clampography-surface">...</div>
<div class="bg-clampography-primary">...</div>

<!-- Text -->
<p class="text-clampography-text">...</p>
<h1 class="text-clampography-heading">...</h1>
<span class="text-clampography-muted">...</span>

<!-- Borders -->
<div class="border border-clampography-border">...</div>
<div class="border-clampography-primary">...</div>

<!-- With opacity -->
<div class="bg-clampography-primary/20">...</div>
<div class="text-clampography-error/70">...</div>
```

### Custom Prefix

```css
@plugin "clampography" {
  prefix: "theme";
}
```

```html
<div class="bg-theme-background text-theme-text">
  <button class="bg-theme-primary">Click</button>
</div>
```

### No Prefix

```css
@plugin "clampography" {
  prefix: false;
}
```

```html
<div class="bg-background text-text">
  <button class="bg-primary">Click</button>
</div>
```

### Reference

#### Available Theme Names

- **light** - Clean light theme with blue accents
- **dark** - Modern dark theme with high contrast

#### Available Color Variables

- `--clampography-background`
- `--clampography-surface`
- `--clampography-border`
- `--clampography-text`
- `--clampography-heading`
- `--clampography-muted`
- `--clampography-primary`
- `--clampography-secondary`
- `--clampography-link`
- `--clampography-success`
- `--clampography-warning`
- `--clampography-error`
- `--clampography-info`

#### Generated Selectors

Understanding what CSS selectors are generated:

| Configuration                     | Generated Selector                               |
| --------------------------------- | ------------------------------------------------ |
| `themes: all`                     | `:where(:root),[data-theme="light"]` for default |
| `themes: "light --default"`       | `:where(:root),[data-theme="light"]`             |
| `themes: "dark --prefersdark"`    | `@media (prefers-color-scheme: dark) { :root }`  |
| `root: "#app"`                    | `:where(#app), #app[data-theme="..."]`           |
| Custom theme with `default: true` | `:where(:root),[data-theme="custom"]`            |
| Custom theme without default      | `[data-theme="custom"]` only                     |

**Note:** `:where()` is used for default themes to keep specificity low,
allowing `[data-theme]` to easily override.

---

## Color Formats

### OKLCH (Recommended)

```css
@plugin "clampography/theme" {
  primary: "oklch(60% 0.25 270)";
}
```

**Benefits:**

- Perceptually uniform colors
- Better gradients
- Full support for opacity modifiers (`/20`, `/50`, etc.)

### HEX and RGB (Supported)

```css
@plugin "clampography/theme" {
  primary: "#3b82f6";
  secondary: "rgb(59, 130, 246)";
}
```

**Note:** Plugin will show an informational message suggesting OKLCH for better
color space support.

---

## Opacity Modifiers

All colors support Tailwind's opacity modifiers when using OKLCH format:

```html
<div class="bg-clampography-primary/10">10% opacity</div>
<div class="bg-clampography-primary/20">20% opacity</div>
<div class="bg-clampography-primary/50">50% opacity</div>
<div class="text-clampography-error/70">70% opacity</div>
```

**Note:** For best compatibility with opacity modifiers, use OKLCH format. HEX
and RGB colors may not work with opacity modifiers in all cases.

---

## Troubleshooting

### No colors appear on my page

**Problem:** Page has no background/text colors.

**Solution:** Make sure you have:

- Loaded at least one theme with `default: true` or `--default` flag
- Or manually added `data-theme` attribute to an element

```css
/* Bad - no default specified, page will be unstyled by default */
@plugin "clampography" {
  themes: "dark";
}

/* Good - has default */
@plugin "clampography" {
  themes: "dark --default";
}
```

### Utilities not working (Class not found)

**Problem:** `bg-background` doesn't work.

**Solution:** By default, utilities have the `clampography-` prefix:

```html
<!-- Wrong -->
<div class="bg-background"></div>

<!-- Correct -->
<div class="bg-clampography-background"></div>
```

To remove prefix:

```css
@plugin "clampography" {
  prefix: false;
}
```

### Theme not changing with data-theme

**Problem:** Setting `data-theme` attribute doesn't change colors.

**Solution:** Check if you're using custom `root` option. If `root: "#app"`,
then `data-theme` must be on `#app` element or its child:

```html
<!-- If root: "#app" -->
<div id="app" data-theme="dark">
  <!-- Theme works here -->
</div>

<!-- If root: ":root" (default) -->
<body data-theme="dark">
  <!-- Theme works here -->
</body>
```

### Custom root not working

**Problem:** Set `root: "#my-app"` but styles don't apply.

**Solution:** Make sure the element with that ID exists in your HTML:

```html
<!-- Required for root: "#my-app" -->
<div id="my-app">
  <!-- Styles apply here -->
</div>
```

### Opacity modifiers not working

**Problem:** `bg-clampography-primary/20` doesn't work.

**Solution:** Use OKLCH format for colors. HEX and RGB may not support opacity
modifiers:

```css
/* Good - supports opacity */
@plugin "clampography/theme" {
  primary: "oklch(60% 0.25 270)";
}

/* May not work with /20, /50, etc. */
@plugin "clampography/theme" {
  primary: "#3b82f6";
}
```

### Too many console logs

**Problem:** Build output is cluttered with plugin messages.

**Solution:** Disable logs:

```css
@plugin "clampography" {
  logs: false;
}

@plugin "clampography/theme" {
  logs: false;
}
```

---

## Need Help?

- 🐛 [Report Issues](https://github.com/Avaray/clampography/issues)
- 💬 [Discussions](https://github.com/Avaray/clampography/discussions)
