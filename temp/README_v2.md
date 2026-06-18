# 🙌 Clampography

> **WARNING**: Beta 2.0.0 is in development and currently unstable.

## The Problem
[Tailwind's Preflight](https://tailwindcss.com/docs/preflight) is fantastic, but it ruthlessly strips away all browser typography defaults. If you're building a blog, a documentation site, or a text-heavy application, you're suddenly forced to manually style every `<h1>`, `<p>`, and `<ul>`, while struggling to make the font sizes responsive across mobile and desktop.

## The Solution
**Clampography** is a [Tailwind CSS v4](https://tailwindcss.com/) plugin that instantly restores beautiful, production-ready typography to your project. Powered by an internal **Fluid Math Engine**, it calculates mathematically perfect `clamp()` values for all typography and spacing, meaning your text will scale flawlessly between mobile and desktop without writing a single media query.

And unlike other global resets, Clampography is modular: you can isolate its styles to a single CSS class (Prose Mode), enable W3C Figma Tokens, and opt-in to a powerful OKLCH-based theming system.

## Installation

```bash
npm install clampography
# or pnpm add / bun install
```

## How to use it

### 1. Pure Typography (No Colors)
Load the plugin in your CSS. By default, it manages size, spacing, weight, and layout structure, leaving the aesthetic color choices entirely to you.

```css
@import "tailwindcss";
@plugin "clampography";
```

### 2. Typography + Themes
Need a design system out of the box? Enable the theming engine to get automatic light/dark mode switching and beautifully balanced OKLCH colors.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
}
```

```html
<!-- Easily toggle themes -->
<body data-theme="dark">
  <div class="bg-clampography-background text-clampography-text">
    <h1>Perfectly Scaled Heading</h1>
    <button class="bg-clampography-primary">Action</button>
  </div>
</body>
```

### 3. Scope Isolation (Don't break your UI!)
Building an admin panel next to a blog post? Prevent Clampography from restyling your entire app by isolating it to a single class:

```css
@plugin "clampography" {
  themes: all;
  typography: ".clampography"; /* Styles will only apply inside this class */
}
```

## Key Configuration

Customize exactly what Clampography injects into your bundle:

```css
@plugin "clampography" {
  /* Features */
  themes: "light, dark";          /* OKLCH themes */
  forms: true;                    /* Stylized form inputs */
  kbd: true;                      /* 3D keyboard shortcuts */
  print: true;                    /* Ink-friendly print styles */
  extra: true;                    /* Visual decorations & Accessibility */

  /* Advanced Fluid Math Bounds */
  fluid-min: "320px";
  fluid-max: "1280px";
}
```

## Learn More
📖 **[Read the Complete Usage Guide](docs/usage.md)** to learn about Custom OKLCH Themes, Scoped Component Theming, and Figma Integration.

**License:** [MIT](LICENSE)
