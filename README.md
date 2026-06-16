# 🙌 Clampography

> ⚠️ **DEPRECATION NOTICE: VERSION 1**
> 
> Version 1 of Clampography (currently `0.9.11`) is no longer being developed and will soon be replaced by a new version. Please note that the upcoming release will introduce major **breaking changes**. Version 1 has multiple known bugs and **should not be used**.
> 
> If you are interested, you can try the upcoming beta from the [v2](https://github.com/Avaray/clampography/tree/v2) branch, which is available on [NPM here](https://www.npmjs.com/package/clampography?activeTab=versions).

**Clampography** is a pure CSS typography system that uses the
[clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp)
function for fluid, responsive text scaling. It's designed as an alternative to
[@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography),
but works with or without [Tailwind CSS](https://tailwindcss.com/). With
[94% global browser support](https://caniuse.com/css-math-functions), it works
on nearly all modern devices.

- **No default styling:** No colors, borders, transforms, or decorations.
- **Structure only:** Manages size, spacing, weight, and font-family.
- **Smart scaling:** Contextual elements use `em` (relative), blocks use
  `clamp()` (fluid).

## The purpose

[CSS resets](https://en.wikipedia.org/wiki/Reset_style_sheet) like
[Tailwind's Preflight](https://tailwindcss.com/docs/preflight) remove all
browser typography defaults, leaving you with unstyled text. **Clampography**
delivers production-ready text scaling that responds to viewport changes
automatically, while leaving all aesthetic choices to you.

Visit the temporary [demo page](https://next.dav.one/clampography/) to see how
it looks.

## Requirements

Use [Vite](https://vitejs.dev/), [Webpack](https://webpack.js.org/), or similar
build tool for CSS bundling. Popular frameworks like
[Astro](https://astro.build/), [Next.js](https://nextjs.org/),
[Remix](https://remix.run/), and
[SvelteKit](https://svelte.dev/docs/kit/introduction) include CSS bundling by
default and work seamlessly with **Clampography**. Without a build tool, native
CSS `@import` combined with `@layer` has about 91% browser coverage and only
works in browsers released since early 2022.

## Installation

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

## Usage

```css
/* First import Tailwind CSS */
@import "tailwindcss";

/* Then import Clampography */
@import "clampography";

/* Then you can override Clampography's base styles */
@layer base {
  h1 {
    font-size: clamp(2.35rem, 1.95rem + 1.5vw, 4rem);
    font-weight: 400;
    line-height: 1.15;
  }
}
```
