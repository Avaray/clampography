# Clampography — Descriptions

A set of description variants for use in READMEs, landing pages, social media, npm, etc.

---

## 1. One-liner (npm / package.json)

> Fluid typography system based on CSS `clamp()` with optional themes. A feature-rich Tailwind CSS plugin for blogs, docs, and content-heavy sites.

---

## 2. Short (2–3 sentences / social media / GitHub About)

**Clampography** is a Tailwind CSS plugin that gives your text exactly what browser resets take away — production-ready, fluid typography that scales smoothly across every screen size. It manages heading sizes, spacing, and structure via mathematically-precise `clamp()` functions, leaving all visual choices to you. Add optional built-in themes with OKLCH colors or create your own.

---

## 3. Medium (README intro / landing page hero)

**Clampography** is a CSS typography system built as a Tailwind CSS v4 plugin, designed primarily for blogs, documentation sites, and content-heavy web apps.

When you apply a CSS reset (like Tailwind's Preflight), browser typography defaults vanish — leaving you with a blank slate and no readable text hierarchy. Clampography fills that gap: it delivers a fluid, responsive type scale using `clamp()` math, so your headings and body text scale naturally from mobile to ultra-wide without a single media query.

Theming is optional. Use the built-in `light` and `dark` themes, pick from hundreds of community palettes, or define your own using modern OKLCH colors. Everything is overridable through CSS custom properties with zero specificity, so your own styles always win.

---

## 4. Technical / developer-focused

**Clampography** is a zero-configuration Tailwind CSS v4 plugin that replaces the browser's stripped typography defaults with a mathematically precise, viewport-fluid type system.

**Under the hood:**
- Every heading (`h1`–`h6`) and spacing token is driven by a `clamp()` function computed from configurable viewport bounds (`fluid-min` / `fluid-max`).
- CSS custom properties (`--clampography-h1-min`, `--clampography-h1-max`, etc.) are exposed as unitless rem values — override any one of them in `:root` and the slope recalculates automatically via CSS `calc()`. No rebuild required.
- All variables are declared inside `:where(:root)` — zero specificity — so user styles **always** win without `!important`.
- Themes are defined as sets of OKLCH CSS variables (`--clampography-primary`, `--clampography-background`, etc.) and activated via `data-theme` attributes. Supports `prefers-color-scheme`, scoped roots, and custom theme plugins.
- Optional modules: `extra` (colored decorations), `forms` (themed inputs & buttons), `kbd` (3D keyboard key effect), `print` (print-optimized styles).

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  extra: true;
}
```

---

## 5. Marketing / landing page (punchy)

**Your content deserves better than unstyled text.**

Clampography is the typography plugin that makes every heading, paragraph, and list look right — on every screen — from the first line of CSS. No breakpoints. No magic numbers. Just clean, fluid type powered by `clamp()` math and sensible defaults that stay out of your way.

Light/dark themes included. OKLCH colors. Zero specificity conflicts. Works with Tailwind CSS v4.

---

## 6. Comparison-focused (vs. @tailwindcss/typography)

**Clampography** is an alternative to `@tailwindcss/typography` for projects that need fluid, viewport-responsive typography rather than fixed `prose` sizes.

| Feature | `@tailwindcss/typography` | **Clampography** |
|---|---|---|
| Font scaling | Fixed sizes at breakpoints | Fluid `clamp()` — no breakpoints |
| Theming | Via Tailwind config | Built-in + custom OKLCH themes |
| Scope isolation | `.prose` class | Configurable `.clampography` or global |
| Override mechanism | Tailwind config | CSS custom properties (zero specificity) |
| Forms / KBD styling | ❌ | ✅ Optional modules |
| Activation | Class-based | Element-level or global |

Clampography is **structure-first** — it controls size, spacing, and scale, but never imposes colors or decorations unless you explicitly opt in.
