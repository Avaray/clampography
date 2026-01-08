/**
 * Extra opinionated styles and coloring.
 * Applies colors to the structural base elements.
 */

export default {
  // Basic Body Styles
  "body": {
    "background-color": "oklch(var(--clampography-background))",
    "color": "oklch(var(--clampography-text))",
  },

  // Headings
  ":where(h1, h2, h3, h4, h5, h6)": {
    "color": "oklch(var(--clampography-heading))",
  },

  // Links
  "a": {
    "color": "oklch(var(--clampography-link))",
    "font-weight": "700",
    "letter-spacing": "0.025em",
    "text-decoration-line": "underline",
    "text-decoration-thickness": "2px",
    "text-underline-offset": "4px",
    "transition-property": "color, text-decoration-color",
    "transition-duration": "150ms",
  },

  "a:hover": {
    "text-decoration-color": "oklch(var(--clampography-link))",
  },

  // Lists - Bullet points
  "ul > li::before": {
    "background-color": "oklch(var(--clampography-primary))",
  },

  // Lists - Numbered points
  "ol > li::before": {
    "color": "oklch(var(--clampography-secondary))",
  },

  // Inline Code
  ":where(code, kbd, samp)": {
    "background-color": "oklch(var(--clampography-surface))",
    "color": "oklch(var(--clampography-heading))",
    "border": "1px solid oklch(var(--clampography-border))",
    "border-radius": "0.25rem",
    "padding": "0.125rem var(--spacing-xs)",
  },

  // Keyboard input - vertical alignment
  "kbd": {
    transform: "translateY(-0.15em)",
  },

  // Preformatted Code Blocks
  "pre": {
    "background-color": "oklch(var(--clampography-surface))",
    "border": "1px solid oklch(var(--clampography-border))",
    "border-radius": "0.375rem",
    "padding": "1rem",
  },

  // Tables
  "table": {
    "padding": "var(--spacing-sm)",
    "border": "1px solid oklch(var(--clampography-border))",
  },

  "th": {
    "color": "oklch(var(--clampography-heading))",
  },

  "th, td": {
    "border": "1px solid oklch(var(--clampography-border))",
  },

  "thead th": {
    "border-bottom-width": "2px",
  },

  // Zebra striping for table rows
  "tbody tr:nth-child(even)": {
    "background-color": "oklch(var(--clampography-surface))",
  },

  // Captions & Muted text
  "caption, figcaption, .muted": {
    "color": "oklch(var(--clampography-muted))",
  },

  // Horizontal Rule (Thematic)
  "hr": {
    "height": "1px",
    "border-width": "0",
    "margin-top": "3rem",
    "margin-bottom": "3rem",
    "background-color": "oklch(var(--clampography-border))",
  },

  // Styled Blockquote
  "blockquote": {
    "border-left-width": "4px",
    "border-left-color": "oklch(var(--clampography-primary))",
    "background-color": "oklch(var(--clampography-surface))",
    "padding": "1rem",
    "border-radius": "0.25rem",
    "font-style": "italic",
    "color": "oklch(var(--clampography-heading))",
  },

  // Styled Links (Enhanced)
  "a": {
    "font-weight": "700",
    "letter-spacing": "0.025em",
    "text-decoration-line": "underline",
    "text-decoration-thickness": "2px",
    "text-underline-offset": "4px",
    "transition-property": "color, text-decoration-color",
    "transition-duration": "150ms",
  },

  "a:hover": {
    "text-decoration-color": "oklch(var(--clampography-primary))",
  },

  // Mark
  "mark": {
    "background-color": "oklch(var(--clampography-primary))",
    "color": "oklch(var(--clampography-background))",
    "padding": "0.125rem var(--spacing-xs)",
    "border-radius": "0.25rem",
  },

  // Deleted Text
  "del": {
    "text-decoration-color": "oklch(var(--clampography-secondary))",
    "text-decoration-thickness": "2px",
  },

  // Fieldset
  "fieldset": {
    "border": "1px solid oklch(var(--clampography-border))",
    "border-radius": "0.375rem",
  },

  "legend": {
    "color": "oklch(var(--clampography-heading))",
  },

  // Details
  "details": {
    "border": "1px solid oklch(var(--clampography-border))",
    "border-radius": "0.375rem",
    "padding": "0.5rem",
  },

  // Summary
  "summary": {
    "color": "oklch(var(--clampography-heading))",
  },

  "details[open] > summary": {
    "border-bottom": "1px solid oklch(var(--clampography-border))",
    "padding-bottom": "0.5rem",
  },
};
