# 🙌 Clampography

**Clampography** is a typography and theming plugin for [Tailwind CSS](https://tailwindcss.com/). 

When you use Tailwind CSS, the [Preflight](https://tailwindcss.com/docs/preflight) reset removes all browser defaults. You get a completely blank slate, which is great for UI, but terrible for blog articles or documentation pages because all your `<h1>`, `<p>`, `<ul>`, and other tags lose their styling.

**Clampography solves this.** It restores typography defaults and makes them mathematically perfect. It automatically generates a fluid type scale using [CSS clamp() functions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp). Your text and spacing will scale smoothly between mobile and 4K displays - without writing a single media query.

> [!NOTE]
> Clampography is designed for projects using a build tool like [Vite](https://vitejs.dev/) or [Webpack](https://webpack.js.org/), or a framework with CSS bundling like [Astro](https://astro.build/), [Next.js](https://nextjs.org/), [Remix](https://remix.run/), or [SvelteKit](https://svelte.dev/docs/kit/introduction). With a build tool, unused modules are automatically removed, keeping your CSS bundle small.
> A build tool is not required - CDN files are also available. However, CDN files cannot be tree-shaken, resulting in a significantly larger CSS file.

## ✨ Features
- 🧮 **Fluid Typography & Spacing:** Smooth scaling from mobile to desktop.
- 🎨 **Built-in Themes:** `light` and `dark` included. More themes coming soon.
- 🧩 **Modular:** Enable only what you need.
- 🎯 **Zero Specificity:** All styles use `:where()` - your own CSS always wins, no `!important` needed.
- 🔌 **TypeScript Ready:** Auto-generated [TypeScript](https://www.typescriptlang.org/) types for all CSS variables.
- 🌍 **RTL Ready:** Works correctly in right-to-left languages out of the box.
- 🎨 **Figma Design Tokens:** Theme values exported as `figma-tokens.json` (W3C Design Tokens).
- 🖨️ **Print & A11y Optimization:** Removes decorations and forces readable black text.

## 📦 Install

```bash
npm install clampography
```

## 🛠️ Quick Start

### 1. Basic (Fluid Typography Only)
This restores typography but keeps it clean. No colors are injected.

```css
@import "tailwindcss";
@plugin "clampography";
```

### 2. Full Experience (Themes + UI)
This adds colors, styled forms, and extra decorations.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  forms: true;
  extra: true;
}
```

```html
<body data-theme="dark" class="bg-clampography-background text-clampography-text">
  <h1>Fluid Heading</h1>
  <button class="bg-clampography-primary">Action</button>
</body>
```

### 3. Prose Mode (Isolate Styles)
Don't want to style the whole page? Isolate the typography to a specific class.

```css
@plugin "clampography" {
  typography: ".blog-content";
}
```

```html
<article class="blog-content">
  <!-- Only text inside here gets styled -->
  <h1>My Blog Post</h1>
</article>
```

## ⚙️ Configuration

Clampography is highly modular. You can configure it directly in your CSS:

```css
@plugin "clampography" {
  /* Feature Modules */
  themes: "light, dark" | "all" | false;  /* (default: false) */
  base: true | false;                     /* (default: true) */
  forms: true | false;                    /* (default: false) */
  kbd: true | false;                      /* (default: false) */
  print: true | false;                    /* (default: false) */
  extra: true | false;                    /* (default: false) */

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

## 🙏 Inspirations
- [daisyUI](https://daisyui.com/) created by [Pouya Saadeghi](https://saadeghi.com/)
- The official **Typography** plugin for Tailwind CSS: [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)

---

**License:** [MIT](LICENSE)
