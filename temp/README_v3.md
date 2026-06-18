# 🙌 Clampography

> **WARNING**: Beta 2.0.0 is in development and currently unstable.

Clampography is a [Tailwind CSS v4](https://tailwindcss.com/) typography and OKLCH-theming plugin. It automatically generates mathematically perfect `clamp()` functions for your text and spacing, ensuring a flawless responsive design from mobile to 4K displays.

## 📦 Install

```bash
npm install clampography
```

## 🛠️ Usage

### 1. Basic (Fluid Typography Only)
Restores HTML typography defaults removed by Tailwind's preflight, but makes them fluid and responsive. No colors are injected.

```css
@import "tailwindcss";
@plugin "clampography";
```

### 2. Full Experience (Themes + Forms)
Injects 90+ OKLCH themes, form styles, and interactive elements.

```css
@import "tailwindcss";
@plugin "clampography" {
  themes: all;
  forms: true;
}
```

```html
<main data-theme="dark" class="bg-clampography-background text-clampography-text">
  <h1>Fluid Heading</h1>
  <button class="bg-clampography-primary">Action</button>
</main>
```

### 3. Prose Mode (Scope Isolation)
Prevent Clampography from restyling your entire app by isolating it to a specific class.

```css
@plugin "clampography" {
  typography: ".prose-content";
}
```

```html
<div class="prose-content">
  <!-- Only typography inside here is styled! -->
  <h1>Article</h1>
</div>
```

## ⚙️ Configuration

Clampography is highly modular. Enable only what you need.

```css
@plugin "clampography" {
  /* Feature Modules */
  themes: "light, dark" | "all" | false;
  forms: true | false;
  kbd: true | false;
  print: true | false;
  extra: true | false;

  /* Typography Isolation */
  typography: "global" | ".your-class";
  
  /* Fluid Math Engine Bounds */
  fluid-min: "320px";
  fluid-max: "1280px";
  
  /* Theme Variable Scoping */
  root: ":root" | "#app";
}
```

## 📚 Documentation
- 📖 **[Complete Usage Guide](docs/usage.md)** (Custom themes, Figma integration, A11y)
- 🤝 **[Contributing](docs/contributing.md)**

**License:** [MIT](LICENSE)
