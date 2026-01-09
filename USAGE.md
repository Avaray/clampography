# Clampography Usage Guide

Complete guide from basic setup to advanced theming scenarios.

---

## Table of Contents

- [Basic Usage](#basic-usage)
- [Built-in Themes](#built-in-themes)
- [Custom Themes](#custom-themes)
- [Advanced Scenarios](#advanced-scenarios)
- [Color Formats](#color-formats)
- [Opacity Modifiers](#opacity-modifiers)
- [Troubleshooting](#troubleshooting)

---

## Basic Usage

### Minimal Setup (No Themes)

Load only typography and spacing styles without any colors.

```css
@import 'tailwindcss';
@plugin 'clampography';
```

**Result:**
- ✅ Typography styles (headings, paragraphs, lists)
- ✅ Fluid spacing system
- ✅ Structural base styles
- ❌ No colors loaded

**Use case:** When you want to use your own color system but need the typography.

---

### Basic Setup with Colors

Load default light/dark themes that respect system preferences.

```css
@import 'tailwindcss';
@plugin 'clampography' {
  themes: all;
}
```

**Result:**
```css
/* Light theme by default */
:root {
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

/* All themes available for manual switching */
[data-theme="light"] { /* ... */ }
[data-theme="dark"] { /* ... */ }
[data-theme="retro"] { /* ... */ }
[data-theme="cyberpunk"] { /* ... */ }
```

**Use case:** Most common setup. Automatic light/dark switching + manual theme picker.

---

### With Extra Opinionated Styles

Add colored borders, backgrounds, and enhanced styling.

```css
@import 'tailwindcss';
@plugin 'clampography' {
  themes: all;
  base: true;    /* default: true */
  extra: true;   /* default: false */
}
```

**Result:**
- ✅ All base styles
- ✅ Colored elements (tables, code blocks, forms)
- ✅ Enhanced blockquotes with background
- ✅ Styled buttons and inputs
- ✅ Zebra-striped tables

**Use case:** When you want a complete, ready-to-use styled design system.

---

## Built-in Themes

### Available Themes

- `light` - Clean light theme with blue accents
- `dark` - Modern dark theme with high contrast
- `retro` - Warm, vintage-inspired palette
- `cyberpunk` - Neon colors with dark background

### Load Specific Themes

```css
@plugin 'clampography' {
  themes: "light, dark";
}
```

**Result:**
```css
/* Light as default */
:root { /* light colors */ }

/* Dark for system dark mode */
@media (prefers-color-scheme: dark) {
  :root { /* dark colors */ }
}

/* Both available for manual switching */
[data-theme="light"] { /* ... */ }
[data-theme="dark"] { /* ... */ }
```

---

### Customize Default Behavior

Override which theme is default and which responds to `prefers-color-scheme`.

```css
@plugin 'clampography' {
  themes: "dark--default, light--prefersdark, retro, cyberpunk";
}
```

**Result:**
```css
/* Dark theme by default */
:root { /* dark colors */ }

/* Light theme for users who prefer light mode */
@media (prefers-color-scheme: dark) {
  :root { /* light colors */ }
}

/* All themes available for manual switching */
[data-theme="dark"] { /* ... */ }
[data-theme="light"] { /* ... */ }
[data-theme="retro"] { /* ... */ }
[data-theme="cyberpunk"] { /* ... */ }
```

**Use case:** Dark-first website that respects user preferences.

---

### Load Only Specific Themes (No Auto-switching)

```css
@plugin 'clampography' {
  themes: "retro, cyberpunk";
}
```

**Result:**
```css
/* Retro as default (first in list) */
:root { /* retro colors */ }

/* Cyberpunk for dark mode users */
@media (prefers-color-scheme: dark) {
  :root { /* cyberpunk colors */ }
}

/* Both available for manual switching */
[data-theme="retro"] { /* ... */ }
[data-theme="cyberpunk"] { /* ... */ }
```

---

## Custom Themes

### Basic Custom Theme

Create your own theme with OKLCH colors.

```css
@import 'tailwindcss';
@plugin 'clampography' {
  themes: false;  /* Disable built-in themes */
}

@plugin 'clampography/theme' {
  name: "brand";
  default: true;
  color-scheme: light;
  
  primary: "oklch(60% 0.25 270)";     /* Purple */
  secondary: "oklch(70% 0.20 150)";   /* Green */
  background: "oklch(99% 0.005 270)"; /* Light purple tint */
  text: "oklch(20% 0.02 270)";        /* Dark purple-gray */
}
```

**Result:**
```css
:root {
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

[data-theme="brand"] { /* same colors */ }
```

**Important:** You don't need to define all 13 colors. Missing colors are automatically filled from the fallback theme based on `color-scheme`.

---

### Light + Dark Custom Themes

Create both light and dark versions of your brand.

```css
@plugin 'clampography' {
  themes: false;
}

@plugin 'clampography/theme' {
  name: "brand-light";
  default: true;
  color-scheme: light;
  
  primary: "oklch(60% 0.25 270)";
  background: "oklch(99% 0.005 270)";
  text: "oklch(20% 0.02 270)";
}

@plugin 'clampography/theme' {
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
:root { /* brand-light colors */ }

/* Dark for dark mode users */
@media (prefers-color-scheme: dark) {
  :root { /* brand-dark colors */ }
}

[data-theme="brand-light"] { /* ... */ }
[data-theme="brand-dark"] { /* ... */ }
```

---

### All 13 Available Colors

You can customize any of these colors in your theme:

```css
@plugin 'clampography/theme' {
  name: "complete";
  
  background: "oklch(...)";  /* Page background */
  surface: "oklch(...)";     /* Cards, code blocks, elevated surfaces */
  border: "oklch(...)";      /* Borders, dividers */
  
  text: "oklch(...)";        /* Body text */
  heading: "oklch(...)";     /* Headings (h1-h6) */
  muted: "oklch(...)";       /* Captions, subtle text */
  
  primary: "oklch(...)";     /* Main brand color, buttons, links */
  secondary: "oklch(...)";   /* Accent color, highlights */
  link: "oklch(...)";        /* Link color (defaults to primary) */
  
  success: "oklch(...)";     /* Success messages, positive actions */
  warning: "oklch(...)";     /* Warnings, alerts */
  error: "oklch(...)";       /* Errors, destructive actions */
  info: "oklch(...)";        /* Information, hints */
}
```

---

### Mix Built-in + Custom Themes

Use built-in themes alongside your custom ones.

```css
@plugin 'clampography' {
  themes: "light, dark";
}

@plugin 'clampography/theme' {
  name: "brand";
  primary: "oklch(60% 0.25 270)";
  secondary: "oklch(70% 0.20 150)";
}
```

**Result:**
- `light` → `:root` (default)
- `dark` → `@media (prefers-color-scheme: dark)`
- All three themes (`light`, `dark`, `brand`) available via `data-theme` attribute

---

## Advanced Scenarios

### Scenario 1: No Built-in Themes, Only Custom

Perfect for maintaining full brand control.

```css
@plugin 'clampography' {
  themes: false;
  base: true;
  extra: true;
}

@plugin 'clampography/theme' {
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
1. No built-in themes loaded
2. Your `corporate` theme becomes `:root`
3. Missing colors filled from `light` theme
4. No automatic dark mode (you define it manually if needed)

---

### Scenario 2: Partial Color Definition

Define only brand colors, let others fall back.

```css
@plugin 'clampography/theme' {
  name: "minimal";
  default: true;
  color-scheme: light;
  
  primary: "oklch(55% 0.28 340)";
  /* Only 1 out of 13 colors defined! */
}
```

**Result:**
```css
:root {
  /* Your custom color */
  --clampography-primary: oklch(55% 0.28 340);
  
  /* Auto-filled from light theme */
  --clampography-background: oklch(100% 0 0);
  --clampography-border: oklch(92% 0.003 264);
  --clampography-error: oklch(63% 0.22 27);
  /* ... all other colors from light */
}
```

---

### Scenario 3: Dark Fallback for Partial Definition

```css
@plugin 'clampography/theme' {
  name: "midnight";
  default: true;
  color-scheme: dark;  /* Use dark as fallback! */
  
  primary: "oklch(75% 0.25 200)";  /* Cyan accent */
  secondary: "oklch(80% 0.25 340)"; /* Pink accent */
}
```

**Result:**
- Your 2 custom colors
- Other 11 colors filled from `dark` theme (dark backgrounds, light text)

---

### Scenario 4: Multiple Custom Themes with Manual Switching

Build a theme switcher for your app.

```css
@plugin 'clampography' {
  themes: false;
}

@plugin 'clampography/theme' {
  name: "ocean";
  default: true;
  primary: "oklch(60% 0.20 220)";  /* Blue */
}

@plugin 'clampography/theme' {
  name: "forest";
  primary: "oklch(60% 0.20 140)";  /* Green */
}

@plugin 'clampography/theme' {
  name: "sunset";
  primary: "oklch(65% 0.25 40)";   /* Orange */
}
```

**HTML:**
```html
<body data-theme="ocean">
  <!-- Ocean theme active -->
</body>

<body data-theme="forest">
  <!-- Forest theme active -->
</body>
```

**JavaScript:**
```javascript
// Theme switcher
const themes = ['ocean', 'forest', 'sunset'];
document.body.setAttribute('data-theme', themes[selectedIndex]);
```

---

### Scenario 5: Respect System + Manual Override

Most flexible setup for users.

```css
@plugin 'clampography' {
  themes: "light, dark";
}

@plugin 'clampography/theme' {
  name: "high-contrast";
  primary: "oklch(90% 0.35 270)";
  background: "oklch(5% 0 0)";
  text: "oklch(100% 0 0)";
}
```

**HTML with theme switcher:**
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

---

## Color Formats

### OKLCH (Recommended)

Modern color space with perceptual uniformity.

```css
primary: "oklch(70% 0.25 180)";
```

**Format:** `oklch(lightness chroma hue)`
- **Lightness:** `0%` (black) to `100%` (white)
- **Chroma:** `0` (gray) to `0.4+` (saturated)
- **Hue:** `0-360` (color wheel)

**Benefits:**
- ✅ Works with opacity modifiers (`bg-primary/50`)
- ✅ Perceptually uniform (better gradients)
- ✅ Wider color gamut than sRGB
- ✅ Better for accessibility

---

### HEX (Supported but Limited)

```css
primary: "#3b82f6";
```

**Limitations:**
- ⚠️ Opacity modifiers work but use `color-mix()` (less efficient)
- ⚠️ Smaller color gamut than OKLCH
- ⚠️ Non-perceptual (gradients may look uneven)

**You'll see this warning:**
```
Clampography (mytheme): Color "primary" uses HEX format. 
Consider using OKLCH format for better color space support and smoother gradients.
```

---

### RGB (Supported but Limited)

```css
primary: "rgb(59 130 246)";
```

**Same limitations as HEX.**

---

## Opacity Modifiers

Thanks to Tailwind CSS v4's `color-mix()` support, you can use opacity modifiers with all color formats.

### Usage

```html
<div class="bg-primary">Full opacity</div>
<div class="bg-primary/80">80% opacity</div>
<div class="bg-primary/50">50% opacity</div>
<div class="bg-primary/20">20% opacity</div>
<div class="bg-primary/10">10% opacity</div>

<div class="text-heading/70">70% opacity text</div>
<div class="border-primary/30">30% opacity border</div>
```

### Generated CSS

```css
/* Full opacity */
background-color: var(--clampography-primary);

/* With opacity modifier */
background-color: color-mix(
  in oklab, 
  var(--clampography-primary) 50%, 
  transparent
);
```

---

## Troubleshooting

### No Colors Showing Up

**Problem:** You loaded the plugin but don't see any colors.

**Solution:** Make sure you specified themes:

```css
/* ❌ Wrong - no themes loaded */
@plugin 'clampography';

/* ✅ Correct - themes loaded */
@plugin 'clampography' {
  themes: all;
}
```

---

### Custom Theme Colors Not Applied

**Problem:** Your custom theme doesn't override built-in colors.

**Check:**

1. Is `color-scheme` specified?
```css
@plugin 'clampography/theme' {
  name: "mytheme";
  color-scheme: light;  /* Add this! */
  primary: "oklch(70% 0.25 180)";
}
```

2. Is the color value valid?
```css
/* ❌ Wrong format */
primary: "70% 0.25 180";

/* ✅ Correct format */
primary: "oklch(70% 0.25 180)";
```

---

### Dark Mode Not Working

**Problem:** Light theme always shows, even in dark mode.

**Solution:** Check your configuration:

```css
/* Make sure you loaded both themes */
@plugin 'clampography' {
  themes: "light, dark";  /* or themes: all */
}
```

Or for custom themes:

```css
@plugin 'clampography/theme' {
  name: "brand-dark";
  prefersdark: true;  /* Add this! */
  color-scheme: dark;
}
```

---

### Opacity Modifiers Not Working

**Problem:** `bg-primary/50` doesn't work.

**Check:**

1. Are you using Tailwind CSS v4?
```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0"
  }
}
```

2. Is your color in the correct format?
```css
/* Make sure colors include oklch() wrapper */
primary: "oklch(70% 0.25 180)";  /* ✅ Good */
primary: "70% 0.25 180";          /* ❌ Bad */
```

---

### Warnings About Color Format

**Warning:**
```
Clampography (mytheme): Color "primary" uses HEX format.
```

**This is informational, not an error.** Your theme will work, but consider converting to OKLCH for better results:

```css
/* Before */
primary: "#3b82f6";

/* After (better) */
primary: "oklch(63% 0.258 262)";
```

**Convert HEX to OKLCH:** Use tools like [oklch.com](https://oklch.com) or browser DevTools.

---

## Best Practices

1. **Use `themes: all` for most projects** - Automatic light/dark support
2. **Use OKLCH for custom themes** - Better colors and gradients
3. **Define only colors that differ from default** - Others auto-fill
4. **Set `color-scheme`** - Ensures proper fallback colors
5. **Test in both light and dark modes** - Use browser DevTools
6. **Use opacity modifiers liberally** - `bg-primary/10` for subtle backgrounds

---

## Quick Reference

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `themes` | `string` or `array` | `undefined` | Which themes to load |
| `base` | `boolean` | `true` | Load typography/spacing |
| `extra` | `boolean` | `false` | Load opinionated styles |
| `root` | `string` | `":root"` | Root selector for themes |

### Theme Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | *required* | Theme name |
| `default` | `boolean` | `false` | Apply to `:root` |
| `prefersdark` | `boolean` | `false` | Apply to dark mode |
| `color-scheme` | `"light"` or `"dark"` | `"light"` | Fallback palette |
| `primary` | `string` | from fallback | Main brand color |
| `secondary` | `string` | from fallback | Accent color |
| *(... 11 more colors)* | | | See [All 13 Colors](#all-13-available-colors) |

### Available Theme Names

- `light` - Clean light theme
- `dark` - Modern dark theme
- `retro` - Vintage warm palette
- `cyberpunk` - Neon colors

### Available Color Variables

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

### Tailwind Utilities

All color variables are available as Tailwind utilities:

```html
<!-- Backgrounds -->
<div class="bg-background">...</div>
<div class="bg-surface">...</div>
<div class="bg-primary">...</div>

<!-- Text -->
<p class="text-text">...</p>
<h1 class="text-heading">...</h1>
<span class="text-muted">...</span>

<!-- Borders -->
<div class="border border-border">...</div>
<div class="border-primary">...</div>

<!-- With opacity -->
<div class="bg-primary/20">...</div>
<div class="text-error/70">...</div>
```

---

## Need Help?

- 📖 [Full Documentation](https://github.com/Avaray/clampography)
- 🐛 [Report Issues](https://github.com/Avaray/clampography/issues)
- 💬 [Discussions](https://github.com/Avaray/clampography/discussions)