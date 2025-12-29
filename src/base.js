/**
 * Base typography and layout styles (structure only, no colors).
 */
export default {
  // Global CSS Variables (Spacing & Fonts)
  "@layer base": {
    ":root": {
      "--spacing-xs": "clamp(0.5rem, 0.375rem + 0.625vw, 0.75rem)",
      "--spacing-sm": "clamp(0.75rem, 0.5625rem + 0.9375vw, 1.25rem)",
      "--spacing-md": "clamp(1rem, 0.75rem + 1.25vw, 1.5rem)",
      "--spacing-lg": "clamp(1.5rem, 1.125rem + 1.875vw, 2.5rem)",
      "--spacing-xl": "clamp(2rem, 1.5rem + 2.5vw, 3rem)",
      "--scroll-offset": "5rem",
      "--font-family-base":
        "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      "--font-family-mono":
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  },

  // Body Structure
  "body": {
    "font-family": "var(--font-family-base)",
    "font-size": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
    "line-height": "1.75",
    "text-rendering": "optimizeLegibility",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    "text-wrap": "pretty",
  },

  // Shared Heading Structure
  ":where(h1, h2, h3, h4, h5, h6)": {
    "font-weight": "600",
    "scroll-margin-top": "var(--scroll-offset)",
    "margin-top": "var(--spacing-lg)",
    "margin-bottom": "var(--spacing-xs)",
    "text-decoration": "none",
    "break-after": "avoid",
  },

  // Specific Headings (Values from base.css)
  "h1": {
    "font-size": "clamp(2.25rem, 1.95rem + 1.5vw, 3rem)",
    "line-height": "1.1111",
    "font-weight": "800",
    "margin-top": "0",
    "margin-bottom": "var(--spacing-xl)",
  },

  "h2": {
    "font-size": "clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)",
    "line-height": "1.3333",
    "font-weight": "700",
    "margin-top": "var(--spacing-xl)",
    "margin-bottom": "var(--spacing-md)",
  },

  "h3": {
    "font-size": "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)",
    "line-height": "1.6",
    "margin-top": "var(--spacing-lg)",
    "margin-bottom": "var(--spacing-sm)",
  },

  "h4": {
    "font-size": "clamp(1rem, 0.975rem + 0.125vw, 1.125rem)",
    "line-height": "1.5",
    "margin-top": "var(--spacing-lg)",
    "margin-bottom": "var(--spacing-sm)",
  },

  "h5": {
    "font-size": "1rem",
    "line-height": "1.5",
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-xs)",
  },

  "h6": {
    "font-size": "0.875rem",
    "line-height": "1.5",
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-xs)",
  },

  // Links
  "a": {
    "text-decoration-line": "underline",
    "text-decoration-thickness": "0.0625em",
    "text-underline-offset": "0.15em",
    "cursor": "pointer",
    "text-decoration": "underline",
  },

  ":where(h1, h2, h3, h4, h5, h6) a": {
    "text-decoration": "none",
  },

  // Lists & Menus
  "menu": {
    "list-style": "none",
    "margin-bottom": "var(--spacing-md)",
    "padding-left": "0",
  },

  "menu > li::before": {
    "display": "none",
  },

  "hgroup": {
    "margin-bottom": "var(--spacing-lg)",
  },

  "hgroup :where(h1, h2, h3, h4, h5, h6)": {
    "margin-bottom": "var(--spacing-xs)",
  },

  "hgroup :where(p)": {
    "margin-top": "0",
    "margin-bottom": "0",
    "font-size": "0.875em",
    "font-weight": "400",
    "line-height": "1.5",
  },

  "p": {
    "line-height": "1.75",
    "margin-bottom": "var(--spacing-md)",
    "margin-top": "0",
  },

  // Inline elements
  ":where(strong, b)": {
    "font-weight": "700",
  },

  ":where(em, i, cite, var)": {
    "font-style": "italic",
  },

  "dfn": {
    "font-style": "normal",
    "font-weight": "600",
  },

  "small": {
    "font-size": "0.875em",
    "line-height": "1.5",
  },

  ":where(code, kbd, samp)": {
    "font-family": "var(--font-family-mono)",
    "padding":
      "clamp(0.0625rem, 0.05rem + 0.0625vw, 0.125rem) clamp(0.1875rem, 0.15rem + 0.1875vw, 0.3125rem)",
  },

  ":where(code:not(pre code))": {
    "padding":
      "clamp(0.0625rem, 0.05rem + 0.0625vw, 0.125rem) clamp(0.1875rem, 0.15rem + 0.1875vw, 0.3125rem)",
  },

  ":where(sub, sup)": {
    "font-size": "0.75em",
    "line-height": "0",
    "position": "relative",
    "vertical-align": "baseline",
  },

  "sup": {
    "top": "-0.5em",
  },

  "sub": {
    "bottom": "-0.25em",
  },

  "abbr[title]": {
    "text-decoration": "underline dotted",
    "cursor": "help",
  },

  "del": {
    "text-decoration": "line-through",
  },

  "ins": {
    "text-decoration": "underline",
  },

  "s": {
    "text-decoration": "line-through",
  },

  "u": {
    "text-decoration": "underline",
  },

  "mark": {
    "font-style": "normal",
    "font-weight": "inherit",
  },

  "address": {
    "font-style": "normal",
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-md)",
  },

  "time": {
    "font-style": "normal",
    "font-variant-numeric": "tabular-nums",
  },

  // Blockquotes
  "blockquote": {
    "margin-top": "var(--spacing-lg)",
    "margin-bottom": "var(--spacing-lg)",
    "padding-left": "var(--spacing-md)",
  },

  "blockquote blockquote": {
    "margin-top": "var(--spacing-sm)",
    "margin-bottom": "var(--spacing-sm)",
    "padding-left": "var(--spacing-sm)",
  },

  "q": {
    "font-style": "inherit",
  },

  // Lists
  ":where(ul, ol)": {
    "list-style": "none",
    "margin-bottom": "0",
    "padding-left": "var(--spacing-md)",
    "margin-top": "var(--spacing-xs)",
  },

  "li": {
    "position": "relative",
    "padding-left": "0.375em",
  },

  "li + li": {
    "margin-top": "var(--spacing-xs)",
  },

  "li > :where(ul, ol):first-child": {
    "margin-top": "var(--spacing-xs)",
  },

  "ul > li::before": {
    "content": "''",
    "position": "absolute",
    "left": "-1.125em",
    "top": "calc(0.875em - 0.1875em)",
    "width": "0.375em",
    "height": "0.375em",
    "border-radius": "50%",
  },

  "ol": {
    "counter-reset": "list-counter",
    "margin-top": "0",
    "margin-bottom": "0",
  },

  "ol > li": {
    "counter-increment": "list-counter",
  },

  "ol > li::before": {
    "content": "counter(list-counter) '.'",
    "position": "absolute",
    "left": "-2.5em",
    "width": "1.75em",
    "text-align": "right",
    "font-weight": "600",
  },

  ":where(ul, ol) :where(ul, ol)": {
    "margin-bottom": "0",
    "padding-left": "var(--spacing-md)",
  },

  "dl": {
    "margin-top": "0",
    "margin-bottom": "0",
  },

  "dt": {
    "font-weight": "600",
    "margin-top": "var(--spacing-sm)",
  },

  "dt:first-child": {
    "margin-top": "0",
  },

  "dd": {
    "margin-left": "var(--spacing-md)",
  },

  "dt + dd": {
    "margin-top": "var(--spacing-xs)",
  },

  "dd + dd": {
    "margin-top": "var(--spacing-xs)",
  },

  "dd:last-child": {
    "margin-bottom": "0",
  },

  // Pre / Code
  "pre": {
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-md)",
    "font-family": "var(--font-family-mono)",
    "line-height": "1.6",
    "overflow-x": "auto",
    "break-inside": "avoid",
  },

  "pre code": {
    "font-size": "inherit",
    "padding": "0",
    "border-radius": "0",
  },

  // Fieldset & Form
  "fieldset": {
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-md)",
    "padding": "var(--spacing-md)",
    "border": "0",
  },

  "legend": {
    "font-weight": "600",
    "padding": "0 var(--spacing-xs)",
  },

  "output": {
    "display": "inline-block",
    "font-variant-numeric": "tabular-nums",
  },

  ":where(meter, progress)": {
    "display": "inline-block",
    "vertical-align": "middle",
  },

  // Media
  ":where(img, video)": {
    "max-width": "100%",
    "height": "auto",
    "break-inside": "avoid",
  },

  "figure": {
    "margin-top": "0",
    "margin-bottom": "0",
    "break-inside": "avoid",
  },

  "figcaption": {
    "margin-top": "0.375rem",
    "font-size": "0.875em",
    "line-height": "1.5",
  },

  // Tables
  "table": {
    "width": "100%",
    "margin-top": "0",
    "margin-bottom": "0",
    "border-collapse": "collapse",
    "font-size": "0.9375em",
    "line-height": "1.6",
  },

  "caption": {
    "margin-bottom": "var(--spacing-xs)",
    "font-size": "0.875em",
    "font-weight": "600",
    "text-align": "left",
  },

  "th, td": {
    "padding": "var(--spacing-xs) var(--spacing-sm)",
    "text-align": "left",
    "font-weight": "600",
  },

  "thead th, tbody th, tbody td, tfoot th, tfoot td": {
    "vertical-align": "top",
  },

  "thead th": {
    "vertical-align": "bottom",
  },

  "tbody + tbody": {
    "border-top-width": "2px",
  },

  // Horizontal Rule
  "hr": {
    "margin-top": "var(--spacing-xl)",
    "margin-bottom": "var(--spacing-xl)",
    "border": "0",
  },

  // Interactive
  ":where(:focus, :focus-visible)": {
    "outline-offset": "2px",
  },

  "details": {
    "margin-top": "var(--spacing-md)",
    "margin-bottom": "var(--spacing-md)",
  },

  "summary": {
    "cursor": "pointer",
    "font-weight": "600",
  },

  "details[open] > summary": {
    "margin-bottom": "var(--spacing-xs)",
  },

  "dialog": {
    "font-size": "inherit",
    "line-height": "inherit",
  },

  // Resets
  "ul": {
    "margin-top": "0",
    "margin-bottom": "0",
  },

  ":where(p, pre):first-child": {
    "margin-top": "0",
  },

  ":where(p, pre):last-child": {
    "margin-bottom": "0",
  },

  "@media print": {
    "table": {
      "break-inside": "avoid",
    },
  },
};
