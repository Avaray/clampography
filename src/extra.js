export default {
  // --- Basic Coloring (Applying theme variables) ---
  "body": {
    "background-color": "var(--clampography-background)",
    "color": "var(--clampography-text)",
  },

  ":where(h1, h2, h3, h4, h5, h6)": {
    "color": "var(--clampography-heading)",
  },

  // Styled Links (Enhanced)
  "a": {
    "color": "var(--clampography-link)",
    "font-weight": "600",
    "letter-spacing": "0.025em",
    "text-decoration-line": "underline",
    "text-decoration-thickness": "2px",
    "text-underline-offset": "4px",
    "text-decoration-color":
      "color-mix(in oklab, var(--clampography-link) 30%, transparent)",
    "transition-property": "color, text-decoration-color",
    "transition-duration": "150ms",
  },

  "a:hover": {
    "text-decoration-color": "var(--clampography-link)",
  },

  // Lists
  "ul > li::before": {
    "background-color": "var(--clampography-primary)", // Bullet points
  },

  "ol > li::before": {
    "color": "var(--clampography-primary)", // Numbers
  },

  // Inline Code
  ":where(code:not(pre code), kbd, samp)": {
    "background-color": "var(--clampography-surface)",
    "color": "var(--clampography-heading)",
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.25rem",
    "padding": "0.125rem var(--spacing-xs)",
  },

  // Keyboard input - vertical alignment
  "kbd": {
    transform: "translateY(-0.15em)",
  },

  // Preformatted Code Blocks
  "pre": {
    "background-color": "var(--clampography-surface)",
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.375rem",
    "padding": "1rem",
  },

  // Tables
  "table": {
    "padding": "var(--spacing-sm)",
    "border": "1px solid var(--clampography-border)",
  },

  "th": {
    "color": "var(--clampography-heading)",
  },

  "th, td": {
    "border": "1px solid var(--clampography-border)",
  },

  "thead th": {
    "border-bottom-width": "2px",
  },

  // Zebra striping for table rows
  "tbody tr:nth-child(even)": {
    "background-color": "var(--clampography-surface)",
  },

  // Captions & Muted text
  "caption, figcaption, .muted": {
    "color": "var(--clampography-muted)",
  },

  // Horizontal Rule (Thematic)
  "hr": {
    "height": "1px",
    "border-width": "0",
    "margin-top": "3rem",
    "margin-bottom": "3rem",
    "background-color": "var(--clampography-border)",
  },

  // Styled Blockquote
  "blockquote": {
    "border-left-width": "4px",
    "border-left-color": "var(--clampography-primary)",
    "background-color": "var(--clampography-surface)",
    "padding": "1rem",
    "border-radius": "0.25rem",
    "font-style": "italic",
    "color": "var(--clampography-heading)",
  },

  // Mark
  "mark": {
    "background-color": "var(--clampography-primary)",
    "color": "var(--clampography-background)",
    "padding": "0.125rem var(--spacing-xs)",
    "border-radius": "0.25rem",
  },

  // Deleted Text
  "del": {
    "text-decoration-color": "var(--clampography-secondary)",
    "text-decoration-thickness": "2px",
  },

  // Buttons - All types
  // WILL BE REMOVED FROM THIS FILE
  ":where(button, [type='button'], [type='reset'], [type='submit'])": {
    "padding": "var(--spacing-xs) var(--spacing-sm)",
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.375rem", // ← Rounded corners
  },

  // Inputs - All types
  // WILL BE REMOVED FROM THIS FILE
  ":where(input:not([type='checkbox'], [type='radio']), textarea, select)": {
    "padding": "var(--spacing-xs) var(--spacing-sm)",
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.375rem", // ← Rounded corners
  },

  // Fieldset
  "fieldset": {
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.375rem",
  },

  "legend": {
    "color": "var(--clampography-heading)",
  },

  // Details
  "details": {
    "border": "1px solid var(--clampography-border)",
    "border-radius": "0.375rem",
    "padding": "0.5rem",
  },

  "summary": {
    "color": "var(--clampography-heading)",
  },

  "details[open] > summary": {
    "border-bottom": "1px solid var(--clampography-border)",
    "padding-bottom": "0.5rem",
  },
};
