# 🙌 Clampography

**Clampography** is a typography and theming plugin for [Tailwind CSS v4](https://tailwindcss.com/). 

When you use Tailwind CSS, the [Preflight](https://tailwindcss.com/docs/preflight) reset removes all browser defaults. You get a completely unstyled baseline, which is great for UI, but terrible for blog articles or documentation pages because all your `<h1>`, `<p>`, `<ul>`, and other tags lose their styling.

**Clampography solves this.** It restores typography defaults and makes them mathematically perfect. It automatically generates a fluid type scale using [CSS clamp() functions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp). Your text and spacing will scale smoothly between mobile and 4K displays - without writing a single [media query](https://tailwindcss.com/docs/responsive-design).

**Clampography works anywhere Tailwind CSS works.** It is designed for projects using a build tool like [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/), or [Webpack](https://webpack.js.org/), or a framework with CSS bundling like [Astro](https://astro.build/), [Next.js](https://nextjs.org/), [Nuxt](https://nuxt.com/), [Remix](https://remix.run/), or [SvelteKit](https://svelte.dev/docs/kit/introduction). With a build tool, unused modules (or styles) are automatically removed, keeping your CSS bundle small.

## ✨ Features

- 🧮 **Fluid Typography & Spacing:** Smooth scaling from mobile to desktop.
- 🧩 **Modular:** Enable only what you need.
- 🎨 **Built-in Themes:** `light` and `dark` included. More themes coming soon.
- 🎯 **Zero Specificity:** All styles use `:where()` - your own CSS always wins, no `!important` needed.
- 💬 **TypeScript Ready:** Auto-generated [TypeScript](https://www.typescriptlang.org/) types for all CSS variables.
- 🌍 **RTL Ready:** Works correctly in right-to-left languages out of the box.
- 🎨 **Figma Design Tokens:** Theme values exported as `figma-tokens.json` (W3C Design Tokens).
- 🖱️ **Micro-interactions:** Themed text selections, `<mark>` highlights, and `:target` animations.
- 📜 **Themed Scrollbars:** Automatically colorize browser scrollbars to match your active theme.
- 🖨️ **Print & A11y Optimization:** Removes decorations and forces readable black text.

## 📦 Install

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

## 🛠️ Quick Start

### 1. Basic (Fluid Typography Only)

This restores typography but keeps it clean. No colors are injected.

```css
@import "tailwindcss";
@plugin "clampography";
```

### 2. Optimal Experience (Themes + Extra Styles)

This adds colors, styled forms, and extra decorations.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  forms: true;
  extra: true;
}
```

By enabling these modules, Clampography generates semantic color utilities that automatically adapt to the current theme. You can activate a theme by setting the `data-theme` attribute and use the generated utility classes in your markup:

```html
<body data-theme="dark" class="bg-clampography-background text-clampography-text">
  <h1>Fluid Heading</h1>
  <button class="bg-clampography-primary">Action</button>
</body>
```

## ⚙️ Configuration

Clampography is highly modular. You can configure it directly in your CSS:

```css
@plugin "clampography" {
  /* Feature Modules */
  themes: "light, dark" | "all" | false;  /* (default: false) */
  base: true | false;                     /* (default: true) */
  extra: true | false;                    /* (default: false) */
  forms: true | false;                    /* (default: false) */
  kbd: true | false;                      /* (default: false) */
  print: true | false;                    /* (default: false) */
  scrollbar: true | false;                /* (default: false) */
  highlights: true | false;               /* (default: false) */

  /* Advanced Settings */
  typography: "global" | ".your-class";   /* Scope isolation */
  fluid-min: "320px";                     /* Mobile breakpoint */
  fluid-max: "1280px";                    /* Desktop breakpoint */
}
```

## 📚 Documentation

- 📖 **[Complete Usage Guide](docs/usage.md)**
- 🔄 **[Configuration Flow Diagram](docs/configuration-flow.md)**
- 🤝 **[Contributing](docs/contributing.md)**

## 🌐 Browser Support

Clampography targets modern browsers to keep the CSS output clean, small, and mathematically precise without relying on heavy polyfills or fallbacks.

- **Minimum requirement:** ~94% global support. All modules depend on [:where() and :is()](https://caniuse.com/mdn-css_selectors_where) selectors - without them, styles will not apply at all.
- **Optimal (Themes & Forms):** ~93% global support (additionally requires [oklch()](https://caniuse.com/css-color-functions) and [color-mix()](https://caniuse.com/wf-color-mix)).
- **Container Query scaling** (`scale-mode: container`): ~92% global support (additionally requires [cqi units](https://caniuse.com/css-container-queries)).

## 🙏 Inspirations
- [daisyUI](https://daisyui.com/) created by [Pouya Saadeghi](https://saadeghi.com/)
- The official **Typography** plugin for Tailwind CSS: [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)

---

**License:** [MIT](LICENSE)
