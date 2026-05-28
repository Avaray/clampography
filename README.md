# 🙌 Clampography

> **WARNING**: Beta 2.0.0 is in development and currently unstable.

**Clampography** is a pure CSS typography system designed mainly for blogs and
documentation sites. It uses the CSS `clamp()` function for fluid, responsive
text scaling. Built as a [Tailwind CSS](https://tailwindcss.com/) plugin, it
delivers production-ready typography with optional theming support. Basic
features work in about 95% of browsers using standard CSS
[clamp()](https://caniuse.com/css-math-functions). When you enable Themes with
[oklch()](https://caniuse.com/wf-oklab) colors, browser support decreases to
about 92%.

- **Typography first:** Fluid, responsive text scaling without any styling
- **Structure only:** Manages size, spacing, weight, and font-family
- **Smart scaling:** Contextual elements use `em` (relative), blocks use
  `clamp()` (fluid)
- **Optional theming:** Built-in light/dark themes or create your own with
  [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
  colors

## The purpose

[CSS resets](https://en.wikipedia.org/wiki/Reset_style_sheet) like
[Tailwind's Preflight](https://tailwindcss.com/docs/preflight) remove all
browser typography defaults, leaving you with unstyled text. **Clampography**
delivers production-ready typography that responds to
[viewport](https://en.wikipedia.org/wiki/Viewport) changes automatically, while
leaving all aesthetic choices to you. Add themes only if you need them.



## Requirements

- **Tailwind CSS v4** (required)
- A build tool like [Vite](https://vitejs.dev/),
  [Webpack](https://webpack.js.org/), or framework with CSS bundling like
  [Astro](https://astro.build/), [Next.js](https://nextjs.org/),
  [Remix](https://remix.run/),
  [SvelteKit](https://svelte.dev/docs/kit/introduction)

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
<!-- Required -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/base.min.css" />

<!-- Optional additions -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/extra.min.css" />
<link rel="stylesheet" href="https://unpkg.com/clampography/css/forms.min.css" />
<link rel="stylesheet" href="https://unpkg.com/clampography/css/kbd.min.css" />
```

## Quick Start

### Typography Only

Load just the typography system without any colors:

```css
@import "tailwindcss";
@plugin "clampography";
```

**Result:**

- ✅ Fluid typography (headings, paragraphs, lists, etc.)
- ✅ Responsive spacing system
- ✅ Structural base styles
- ❌ No colors, borders, or decorations

Use your own color system with Tailwind utilities:

```html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  <h1>Fluid Typography</h1>
  <p>Text scales automatically based on viewport size.</p>
</div>
```

### Typography + Built-in Themes (Optional)

Add automatic light/dark theming:

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all; /* Loads all built-in themes */
}
```

**What this adds:**

- Automatic light/dark switching based on `prefers-color-scheme`
- Manual theme switching via `data-theme` attribute
- Tailwind utilities like `bg-clampography-primary`

```html
<div class="bg-clampography-background text-clampography-text">
  <h1 class="text-clampography-heading">Hello World</h1>
  <button class="bg-clampography-primary">Click Me</button>
</div>

<!-- Manual theme switching -->
<body data-theme="dark">...</body>
```

### Custom Theme (Optional)

Create your own theme with OKLCH colors:

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: false;
}

@plugin "clampography/theme" {
  name: "brand";
  default: true;

  primary: "oklch(60% 0.25 270)";
  background: "oklch(99% 0.005 270)";
  text: "oklch(20% 0.02 270)";
  /* Missing colors auto-filled from fallback */
}
```

## Configuration Options

```css
@plugin "clampography" {
  themes: "all" | "light, dark" | false;  /* Load themes (optional) */
  base: true | false;                     /* Typography styles (default: true) */
  extra: true | false;                    /* Enhanced styling (default: false) */
  forms: true | false;                    /* Styled form elements (default: false) */
  kbd: true | false;                      /* 3D keyboard key effect on <kbd> (default: false) */
  prefix: "clampography" | false;         /* Utility class prefix */
  root: ":root" | "#app";                 /* Scope to element */
  logs: true | false;                     /* Console output */
}
```

## Learn More

📖 **[Complete Usage Guide](docs/usage.md)** - Detailed documentation:

- All configuration options
- Built-in themes
- Creating custom themes
- Scoped themes for widgets
- Advanced scenarios
- Tailwind utilities
- Troubleshooting

## Inspirations

Two main inspirations behind this project were:
- **daisyUI** created by [Pouya Saadeghi](https://saadeghi.com/)
- The official **Typography** plugin for Tailwind CSS: [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)

## License

[MIT](LICENSE)
