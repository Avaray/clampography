# 🙌 Clampography v2

> **WARNING**: Beta 2.0.0 is in development and currently unstable.

**Clampography** is a next-generation CSS typography and theming engine for [Tailwind CSS v4](https://tailwindcss.com/). It transforms the way you handle responsive text by utilizing an **Advanced Fluid Math Engine** that calculates perfectly smooth `clamp()` functions out to 4 decimal places—no more hardcoded breakpoints.

Whether you're building a content-heavy blog or a complex SaaS dashboard, Clampography provides production-ready typography, robust OKLCH theming, and W3C Figma Tokens integration, all while keeping your CSS bundles incredibly small.

## ✨ What's new in v2?

- 🧮 **Advanced Fluid Math Engine:** Dynamically calculate typography scaling based on custom `fluid-min` and `fluid-max` viewport boundaries.
- 🛡️ **Scope Isolation (Prose Mode):** Isolate styles to specific areas (e.g., `.clampography`) to prevent global style leaks in complex UIs.
- 🎨 **Figma Design Tokens:** Automatically exports your active themes to a W3C-compliant `figma-tokens.json` file.
- 🌈 **OKLCH Color System:** Fully migrated to the modern `oklch()` color space for perfect interpolation and accessibility.
- 🖨️ **Print & A11y Optimization:** Dedicated print styles and automatic handling of `prefers-reduced-motion` and `prefers-contrast`.

## 📦 Installation

```bash
npm install clampography
# or pnpm add / bun install
```

## 🚀 Quick Start

Add the plugin to your main CSS file. By default, it loads the fluid typography system without any opinionated colors.

```css
@import "tailwindcss";
@plugin "clampography" {
  /* Load fluid typography and structure (default: true) */
  base: true;
  
  /* Load all built-in OKLCH themes (light & dark) */
  themes: all;
  
  /* Optional: Isolate styles to a specific class (Prose Mode) */
  typography: ".clampography";
  
  /* Optional: Custom scaling bounds */
  fluid-min: "375px";
  fluid-max: "1536px";
}
```

### Usage in HTML

```html
<!-- If typography: ".clampography" is set, only elements inside this class get styled! -->
<main class="clampography">
  <h1>Fluid Typography</h1>
  <p>Text and spacing scale beautifully across all screen sizes.</p>
  
  <!-- Use generated Tailwind utilities from your loaded themes -->
  <button class="bg-clampography-primary text-clampography-surface">Action</button>
</main>
```

## ⚙️ Modular Features

Clampography is entirely opt-in. You can enable specific feature modules via configuration:

```css
@plugin "clampography" {
  themes: "light, dark";          /* Enable themes */
  extra: true;                    /* Enhanced visual decorations & A11y */
  forms: true;                    /* Beautifully styled inputs and buttons */
  kbd: true;                      /* 3D isometric keyboard keys */
  print: true;                    /* Ink-friendly @media print styles */
}
```

## 📖 Learn More
Check out the **[Complete Usage Guide](docs/usage.md)** for advanced custom theming, component scoping, and troubleshooting.

---
**Inspirations:** [daisyUI](https://saadeghi.com/) & [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography).  
**License:** [MIT](LICENSE)
