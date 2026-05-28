# Using Clampography via CDN (Vanilla CSS)

If you aren't using Tailwind CSS, you can drop the pre-built stylesheet into your HTML to get all base typography, extra styles, forms, and keyboard key styling instantly.

This approach gives you production-ready, fluid typography without the need for Node.js, Bun, or any build tools.

## Option 1: All-in-One (Recommended)

This includes `base`, `extra`, `forms`, and `kbd` in a single file.

```html
<link rel="stylesheet" href="https://unpkg.com/clampography/css/clampography.min.css" />
<!-- or -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/clampography/css/clampography.min.css" />
```

## Option 2: Modular

If you only want specific modules, you can load them individually. Note that `base.min.css` is required for the fluid typography to work.

```html
<!-- Required: Fluid typography, spacing, structural base -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/base.min.css" />

<!-- Optional: Colored borders, blockquotes, table zebra-stripes -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/extra.min.css" />

<!-- Optional: Styled inputs, buttons, checkboxes, selects -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/forms.min.css" />

<!-- Optional: 3D isometric keyboard key styling for <kbd> -->
<link rel="stylesheet" href="https://unpkg.com/clampography/css/kbd.min.css" />
```

## Version Pinning

In production, it's highly recommended to pin the version to avoid unexpected breaking changes:

```html
<link rel="stylesheet" href="https://unpkg.com/clampography@2.0.0/css/clampography.min.css" />
```
