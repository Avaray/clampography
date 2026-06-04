export default (options = {}) => {
  const root = options.root || ":root";

  // Helper to scope selectors safely (ignoring commas inside parentheses)
  const scope = (selector) => {
    const parts = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < selector.length; i++) {
      const char = selector[i];
      if (char === "(") depth++;
      if (char === ")") depth--;

      if (char === "," && depth === 0) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    return parts
      .filter(Boolean) // Remove empty strings
      .map((part) => {
        if (part === ":root" || part === "body") return root;
        // Avoid double spacing
        return `${root} ${part}`;
      })
      .join(", ");
  };

  // Fluid math engine: Generates mathematically perfect clamp() strings
  // dynamically based on the configured min and max screen sizes.
  const minScreenRem = (options.fluidMin || 320) / 16;
  const maxScreenRem = (options.fluidMax || 1280) / 16;

  const makeFluid = (minRem, maxRem) => {
    // If min and max are the same, or if we have invalid screens, just return the static value
    if (minRem === maxRem || minScreenRem >= maxScreenRem) return `${minRem}rem`;

    const slope = (maxRem - minRem) / (maxScreenRem - minScreenRem);
    const intersection = minRem - slope * minScreenRem;

    const format = (num) => parseFloat(num.toFixed(4));
    
    return `clamp(${minRem}rem, ${format(intersection)}rem + ${format(slope * 100)}vw, ${maxRem}rem)`;
  };

  return {
    // ROOT CONFIGURATION (CSS variables)
    // Uses :where() for zero specificity so user overrides always win regardless of layer/source order
    [`:where(${root})`]: {
      // FLUID SPACING SYSTEM
      "--spacing-xs": makeFluid(0.25, 0.75),
      "--spacing-sm": makeFluid(0.375, 1.25),
      "--spacing-md": makeFluid(0.5, 1.5),
      "--spacing-lg": makeFluid(0.75, 2.5),
      "--spacing-xl": makeFluid(1, 3),
      "--list-indent": makeFluid(1.5, 2),
      "--scroll-offset": "5rem",
      "--font-family-base":
        "Inter, system-ui, -apple-system, 'Segoe UI Variable Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      "--font-family-mono":
        "ui-monospace, 'Cascadia Code', 'Cascadia Mono', 'Segoe UI Mono', 'Ubuntu Mono', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",

      // HEADINGS FLUID TYPOGRAPHY
      // Matches Tailwind CSS sizes: sm (min) to 2xl (max)
      // Override any of these in :root to customize individual headings.
      "--clampography-h1-size": makeFluid(1.875, 4),
      "--clampography-h2-size": makeFluid(1.25, 3),
      "--clampography-h3-size": makeFluid(1.125, 2.25),
      "--clampography-h4-size": makeFluid(1, 1.5),
      "--clampography-h5-size": "1rem",
      "--clampography-h6-size": "0.875rem",

      // Global heading scale multiplier (default: 1 = no scaling).
      // Override in :root to proportionally scale all headings at once.
      // Example: :root { --clampography-heading-scale: 0.85; }
      "--clampography-heading-scale": "1",
      
      // Individual heading scales (default to global scale)
      "--clampography-h1-scale": "var(--clampography-heading-scale)",
      "--clampography-h2-scale": "var(--clampography-heading-scale)",
      "--clampography-h3-scale": "var(--clampography-heading-scale)",
      "--clampography-h4-scale": "var(--clampography-heading-scale)",
      "--clampography-h5-scale": "var(--clampography-heading-scale)",
      "--clampography-h6-scale": "var(--clampography-heading-scale)",
    },

    // BODY STYLES (Typography baseline)
    // Note: font-family is intentionally NOT set here.
    // It is applied in extra.js with user-font priority via --font-sans.
    [root === ":root" ? "body" : root]: {
      "font-size": makeFluid(0.875, 1.125),
      "line-height": "1.75",
      "text-rendering": "optimizeLegibility",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
      "text-wrap": "pretty",
    },

    // HEADINGS (H1-H6)
    [scope(":where(h1, h2, h3, h4, h5, h6)")]: {
      "font-weight": "600",
      "scroll-margin-top": "var(--scroll-offset)",
    },

    [scope("h1")]: {
      "font-size": "calc(var(--clampography-h1-size) * var(--clampography-h1-scale))",
      "line-height": "1.1111",
      "font-weight": "800",
      "margin-top": "0",
      "margin-bottom": "var(--spacing-xl)",
    },

    [scope("h2")]: {
      "font-size": "calc(var(--clampography-h2-size) * var(--clampography-h2-scale))",
      "line-height": "1.3333",
      "font-weight": "700",
      "margin-top": "var(--spacing-xl)",
      "margin-bottom": "var(--spacing-md)",
    },

    [scope("h3")]: {
      "font-size": "calc(var(--clampography-h3-size) * var(--clampography-h3-scale))",
      "line-height": "1.5",
      "margin-top": "var(--spacing-lg)",
      "margin-bottom": "var(--spacing-sm)",
    },

    [scope("h4")]: {
      "font-size": "calc(var(--clampography-h4-size) * var(--clampography-h4-scale))",
      "line-height": "1.5",
      "margin-top": "var(--spacing-lg)",
      "margin-bottom": "var(--spacing-sm)",
    },

    [scope("h5")]: {
      "font-size": "calc(var(--clampography-h5-size) * var(--clampography-h5-scale))",
      "line-height": "1.5",
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-xs)",
    },

    [scope("h6")]: {
      "font-size": "calc(var(--clampography-h6-size) * var(--clampography-h6-scale))",
      "line-height": "1.5",
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-xs)",
    },

    [scope(":is(h1, h2, h3, h4, h5, h6):first-child")]: {
      "margin-top": "0",
    },

    // LINKS
    [scope("a")]: {
      "text-decoration-line": "underline",
      cursor: "pointer",
    },

    [scope(":where(h1, h2, h3, h4, h5, h6) a")]: {
      "text-decoration": "none",
    },

    // MENU
    [scope("menu")]: {
      "list-style": "none",
      "margin-bottom": "var(--spacing-md)",
      "padding-left": "0",
    },

    [scope("menu > li::before")]: {
      display: "none",
    },

    // HGROUP
    [scope("hgroup")]: {
      "margin-bottom": "var(--spacing-lg)",
    },

    [scope("hgroup :where(h1, h2, h3, h4, h5, h6)")]: {
      "margin-bottom": "var(--spacing-xs)",
    },

    [scope("hgroup :where(p)")]: {
      "margin-top": "0",
      "margin-bottom": "0",
      "font-size": "0.875em",
      "font-weight": "400",
      "line-height": "1.5",
    },

    // TEXT CONTENT
    [scope("p")]: {
      "line-height": "1.75",
      "margin-bottom": "var(--spacing-md)",
    },

    [scope(":where(strong, b)")]: {
      "font-weight": "700",
    },

    [scope(":where(em, i, cite, var)")]: {
      "font-style": "italic",
    },

    [scope("dfn")]: {
      "font-style": "italic",
      "font-weight": "600",
    },

    [scope("small")]: {
      "font-size": "0.875em",
      "line-height": "1.5",
    },

    [scope(":where(code, kbd, samp)")]: {
      "font-family": "var(--font-family-mono)",
      "font-size": "0.875em",
      "-webkit-font-smoothing": "auto",
      "-moz-osx-font-smoothing": "auto",
    },

    [scope("kbd")]: {
      "font-weight": "600",
    },

    [scope("data")]: {
      "font-variant-numeric": "tabular-nums",
    },

    [scope(":where(sub, sup)")]: {
      "font-size": "0.75em",
      "line-height": "0",
      position: "relative",
      "vertical-align": "baseline",
    },

    [scope("sup")]: {
      top: "-0.5em",
    },

    [scope("sub")]: {
      bottom: "-0.25em",
    },

    [scope("abbr[title]")]: {
      "text-decoration": "underline dotted",
      "text-underline-offset": "4px",
      cursor: "help",
    },

    [scope("del")]: {
      "text-decoration": "line-through",
    },

    [scope("ins")]: {
      "text-decoration": "underline",
    },

    [scope("s")]: {
      "text-decoration": "line-through",
    },

    [scope("u")]: {
      "text-decoration": "underline",
    },

    [scope("mark")]: {
      "font-style": "normal",
      "font-weight": "inherit",
    },

    [scope("address")]: {
      "font-style": "italic",
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
    },

    [scope("time")]: {
      "font-style": "normal",
      "font-variant-numeric": "tabular-nums",
    },

    // BLOCKQUOTES
    [scope("blockquote")]: {
      "margin-top": "var(--spacing-lg)",
      "margin-bottom": "var(--spacing-lg)",
      "padding-left": "var(--spacing-md)",
    },

    [scope("blockquote blockquote")]: {
      "margin-top": "var(--spacing-sm)",
      "margin-bottom": "var(--spacing-sm)",
      "padding-left": "var(--spacing-sm)",
    },

    [scope("q")]: {
      "font-style": "inherit",
    },

    // LISTS
    [scope(":where(ul, ol)")]: {
      "list-style": "none",
      "margin-bottom": "var(--spacing-md)",
      "padding-left": "var(--list-indent)",
    },

    [scope("li")]: {
      position: "relative",
    },

    [scope("li + li")]: {
      "margin-top": "var(--spacing-xs)",
    },

    // Collapse margins for text-like block elements inside li
    // to prevent them from creating extra gaps around nested lists.
    [scope("li > :where(p, dl, figure, table, pre)")]: {
      "margin-top": "0",
      "margin-bottom": "0",
    },

    [scope("li > blockquote")]: {
      "margin-top": "var(--spacing-sm)",
      "margin-bottom": "var(--spacing-sm)",
    },

    // Nested lists: top gap matches sibling spacing (--spacing-xs).
    // No bottom margin — the next li already gets margin-top from li+li.
    [scope("li > :where(ul, ol)")]: {
      "margin-top": "var(--spacing-xs)",
      "margin-bottom": "0",
    },

    [scope("ul > li::before")]: {
      content: "''",
      position: "absolute",
      right: "100%",
      "margin-right": "0.75em",
      top: "0.65em",
      width: "0.375em",
      height: "0.375em",
      "background-color": "currentColor",
      "border-radius": "50%",
    },

    [scope("ol")]: {
      "counter-reset": "list-counter",
    },

    [scope("ol > li")]: {
      "counter-increment": "list-counter",
    },

    [scope("ol > li::before")]: {
      content: "counter(list-counter) '.'",
      position: "absolute",
      right: "100%",
      "margin-right": "0.5em",
      "font-weight": "600",
      "font-variant-numeric": "tabular-nums",
      "text-align": "right",
      color: "currentColor",
    },

    // DEFINITION LISTS
    [scope("dl")]: {
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
    },

    [scope("dt")]: {
      "font-weight": "600",
      "margin-top": "var(--spacing-sm)",
    },

    [scope("dt:first-child")]: {
      "margin-top": "0",
    },

    [scope("dd")]: {
      "margin-left": "var(--spacing-md)",
    },

    [scope("dt + dd")]: {
      "margin-top": "var(--spacing-xs)",
    },

    [scope("dd + dd")]: {
      "margin-top": "var(--spacing-xs)",
    },

    [scope("dd:last-child")]: {
      "margin-bottom": "0",
    },

    // CODE BLOCKS
    [scope("pre")]: {
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
      "font-family": "var(--font-family-mono)",
      "line-height": "1.6",
      "overflow-x": "auto",
      "-webkit-font-smoothing": "auto",
      "-moz-osx-font-smoothing": "auto",
    },

    [scope("pre code")]: {
      "font-size": "inherit",
      padding: "0",
      background: "none",
      "border-radius": "0",
    },

    // FORMS
    // Structural resets — inherit typography from root, no visual styling here.
    // Visual styling (colors, borders, padding) is handled by forms.js.
    [scope("input, button, textarea, select, optgroup")]: {
      "font-family": "inherit",
      "font-size": "100%",
      "line-height": "inherit",
    },

    [scope("textarea")]: {
      "line-height": "1.5",
    },

    [scope("button, [type='button'], [type='reset'], [type='submit']")]: {
      cursor: "pointer",
    },

    [scope("fieldset")]: {
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
      padding: "var(--spacing-sm)",
    },

    [scope("legend")]: {
      "font-weight": "600",
      padding: "0 var(--spacing-xs)",
    },

    [scope("label")]: {
      display: "inline-block",
      "font-weight": "600",
      "margin-bottom": "var(--spacing-xs)",
    },

    [scope("output")]: {
      display: "inline-block",
      "font-variant-numeric": "tabular-nums",
    },

    [scope(":where(meter, progress)")]: {
      display: "inline-block",
      "vertical-align": "middle",
    },

    // MEDIA
    [scope(":where(img, video, canvas, audio, iframe, svg)")]: {
      "max-width": "100%",
      height: "auto",
      "vertical-align": "middle",
    },

    [scope("figure")]: {
      "margin-top": "var(--spacing-lg)",
      "margin-bottom": "var(--spacing-lg)",
    },

    [scope("figcaption")]: {
      "margin-top": "0.375rem",
      "font-size": "0.875em",
      "line-height": "1.5",
    },

    // TABLES
    [scope("table")]: {
      width: "100%",
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
      "border-collapse": "collapse",
      "font-size": "1em",
      "line-height": "1.6",
    },

    [scope("caption")]: {
      "margin-bottom": "var(--spacing-xs)",
      "font-size": "0.875em",
      "font-weight": "600",
      "text-align": "left",
    },

    [scope("th, td")]: {
      padding: "var(--spacing-xs) var(--spacing-sm)",
      "text-align": "left",
    },

    [scope("th")]: {
      "font-weight": "600",
    },

    [scope("thead th")]: {
      "vertical-align": "bottom",
    },

    [scope("tbody th, tbody td")]: {
      "vertical-align": "top",
    },

    [scope("tfoot th, tfoot td")]: {
      "vertical-align": "top",
    },

    [scope("tbody + tbody")]: {
      "border-top-width": "2px",
    },

    // SEPARATORS
    [scope("hr")]: {
      "margin-top": "var(--spacing-xl)",
      "margin-bottom": "var(--spacing-xl)",
      border: "0",
      "border-top": "1px solid",
    },

    // INTERACTIVE ELEMENTS
    [scope(":where(:focus, :focus-visible)")]: {
      "outline-offset": "2px",
    },

    [scope("details")]: {
      "margin-top": "var(--spacing-md)",
      "margin-bottom": "var(--spacing-md)",
    },

    [scope("summary")]: {
      cursor: "pointer",
      "font-weight": "600",
    },

    [scope("details[open] > summary")]: {
      "margin-bottom": "var(--spacing-xs)",
    },

    [scope("dialog")]: {
      "font-size": "inherit",
      "line-height": "inherit",
    },

    // UTILITIES
    [
      scope(
        ":where(h1, h2, h3, h4, h5, h6, p, ul:not(li > ul, li > ol), ol:not(li > ul, li > ol), dl, blockquote, figure, table, pre):first-child",
      )
    ]: {
      "margin-top": "0",
    },

    [scope(":where(p, ul, ol, dl, blockquote, figure, table, pre):last-child")]:
      {
        "margin-bottom": "0",
      },
  };
};
