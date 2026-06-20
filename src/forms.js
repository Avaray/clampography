export default (options = {}) => {
  const root = options.root || ":root";

  // Helper to scope selectors safely
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
      .filter(Boolean)
      .map((part) => {
        if (part === ":root" || part === "body") return root;
        return `${root} ${part}`;
      })
      .join(", ");
  };

  return {
    // ── Buttons ──────────────────────────────────────────────────────────────
    [scope(":where(button, [type='button'], [type='reset'], [type='submit'])")]: {
      "display": "inline-flex",
      "align-items": "center",
      "justify-content": "center",
      "gap": "var(--clampography-spacing-xs)",
      "padding": "var(--clampography-spacing-xs) var(--clampography-spacing-sm)",
      "background-color": "var(--clampography-surface)",
      "color": "var(--clampography-text)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "font-weight": "500",
      "white-space": "nowrap",
      "transition-property": "background-color, border-color, color, box-shadow",
      "transition-duration": "150ms",
    },

    [scope(":where(button, [type='button'], [type='reset'], [type='submit']):hover")]: {
      "background-color": "var(--clampography-background)",
      "border-color": "var(--clampography-primary)",
    },

    [scope(":where(button, [type='button'], [type='submit']).primary, [type='submit']")]: {
      "background-color": "var(--clampography-primary)",
      "color": "var(--clampography-background)",
      "border-color": "var(--clampography-primary)",
    },

    [scope(":where(button, [type='button'], [type='submit']).primary:hover, [type='submit']:hover")]: {
      "filter": "brightness(1.1)",
    },

    // ── Text Inputs & Textarea ────────────────────────────────────────────────
    [scope(":where(input:not([type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='file'], [type='hidden'], [type='submit'], [type='reset'], [type='button'], [type='image']), textarea, select)")]: {
      "display": "block",
      "width": "100%",
      "padding": "var(--clampography-spacing-xs) var(--clampography-spacing-sm)",
      "background-color": "var(--clampography-background)",
      "color": "var(--clampography-text)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "transition-property": "border-color, box-shadow",
      "transition-duration": "150ms",
    },

    [scope(":where(input:not([type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='file'], [type='hidden'], [type='submit'], [type='reset'], [type='button'], [type='image']), textarea, select):focus-visible")]: {
      "outline": "none",
      "border-color": "var(--clampography-primary)",
      "box-shadow": "0 0 0 3px color-mix(in oklab, var(--clampography-primary) 20%, transparent)",
    },

    [scope(":where(input, textarea, select):disabled")]: {
      "opacity": "0.5",
      "cursor": "not-allowed",
    },

    [scope(":where(input, textarea, select)[readonly]")]: {
      "background-color": "color-mix(in oklab, var(--clampography-surface) 50%, transparent)",
      "cursor": "default",
    },

    [scope(":where(input, textarea, select):where(:user-invalid, [aria-invalid='true'])")]: {
      "border-color": "var(--clampography-error)",
    },

    [scope(":where(input, textarea, select):where(:user-invalid, [aria-invalid='true']):focus-visible")]: {
      "box-shadow": "0 0 0 3px color-mix(in oklab, var(--clampography-error) 20%, transparent)",
    },

    [scope("[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration")]: {
      "-webkit-appearance": "none",
      "appearance": "none",
    },

    [scope("[type='number']::-webkit-inner-spin-button, [type='number']::-webkit-outer-spin-button")]: {
      "height": "auto",
    },

    [scope(":where(input, textarea, select)::placeholder")]: {
      "color": "var(--clampography-muted)",
    },

    // ── Select ────────────────────────────────────────────────────────────────
    [scope("select:not([multiple]):not([size])")]: {
      "appearance": "none",
      "background-image": "linear-gradient(45deg, transparent 50%, var(--clampography-text) 50%), linear-gradient(135deg, var(--clampography-text) 50%, transparent 50%)",
      "background-position": "calc(100% - 1.25rem - 5px) center, calc(100% - 1.25rem) center",
      "background-size": "5px 5px, 5px 5px",
      "background-repeat": "no-repeat",
      "padding-inline-end": "2.5rem",
    },

    [scope("select[multiple], select[size]")]: {
      "appearance": "auto",
      "padding": "var(--clampography-spacing-xs) var(--clampography-spacing-sm)",
    },

    // ── File Input ────────────────────────────────────────────────────────────
    [scope("[type='file']")]: {
      "padding": "0",
      "background-color": "transparent",
      "border": "none",
      "cursor": "pointer",
    },

    [scope("[type='file']::file-selector-button")]: {
      "display": "inline-flex",
      "align-items": "center",
      "padding": "var(--clampography-spacing-xs) var(--clampography-spacing-sm)",
      "margin-inline-end": "var(--clampography-spacing-sm)",
      "background-color": "var(--clampography-surface)",
      "color": "var(--clampography-text)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "font-family": "inherit",
      "font-size": "inherit",
      "cursor": "pointer",
      "transition-property": "background-color, border-color",
      "transition-duration": "150ms",
    },

    [scope("[type='file']:hover::file-selector-button")]: {
      "background-color": "var(--clampography-background)",
      "border-color": "var(--clampography-primary)",
    },

    // ── Checkbox & Radio ──────────────────────────────────────────────────────
    [scope("[type='checkbox'], [type='radio']")]: {
      "width": "1em",
      "height": "1em",
      "accent-color": "var(--clampography-primary)",
      "vertical-align": "middle",
      "cursor": "pointer",
    },

    [scope("[type='checkbox']:focus-visible, [type='radio']:focus-visible")]: {
      "outline": "2px solid var(--clampography-primary)",
      "outline-offset": "2px",
    },

    // ── Range ────────────────────────────────────────────────────────────────
    [scope("[type='range']")]: {
      "accent-color": "var(--clampography-primary)",
      "width": "100%",
      "cursor": "pointer",
    },

    // ── Color Picker ──────────────────────────────────────────────────────────
    [scope("[type='color']")]: {
      "padding": "0.125rem",
      "width": "2.5rem",
      "height": "2.5rem",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "background-color": "var(--clampography-background)",
      "cursor": "pointer",
    },

    [scope("[type='color']::-webkit-color-swatch-wrapper")]: {
      "padding": "0",
    },

    [scope("[type='color']::-webkit-color-swatch")]: {
      "border": "none",
      "border-radius": "0.25rem",
    },

    // ── Fieldset & Legend ────────────────────────────────────────────────────
    [scope("fieldset")]: {
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.5rem",
      "background-color": "var(--clampography-surface)",
    },

    [scope("legend")]: {
      "color": "var(--clampography-heading)",
    },

    // ── Label ────────────────────────────────────────────────────────────────
    [scope("label")]: {
      "color": "var(--clampography-text)",
    },

    // ── Output ───────────────────────────────────────────────────────────────
    [scope("output")]: {
      "color": "var(--clampography-primary)",
      "font-weight": "600",
    },

    // ── Progress ──────────────────────────────────────────────────────────────
    [scope("progress")]: {
      "-webkit-appearance": "none",
      "appearance": "none",
      "width": "100%",
      "height": "1em",
      "background": "transparent",
    },

    // WebKit progress track
    [scope("progress::-webkit-progress-bar")]: {
      "background": "color-mix(in oklab, var(--clampography-text) 20%, transparent)",
    },

    // WebKit progress value
    [scope("progress::-webkit-progress-value")]: {
      "background": "var(--clampography-success)",
    },

    // Firefox progress value
    [scope("progress::-moz-progress-bar")]: {
      "background": "var(--clampography-success)",
    },

    // ── Meter ─────────────────────────────────────────────────────────────────
    // Custom styling for <meter> (accent-color does not work on meter)
    [scope("meter")]: {
      "-webkit-appearance": "none",
      "appearance": "none",
      "width": "100%",
      "height": "1em",
      "background": "transparent",
    },

    // Firefox track (restored via Firefox-only feature query)
    // @supports (-moz-appearance: none) is ignored by all WebKit/Blink browsers
    "@supports (-moz-appearance: none)": {
      [scope("progress")]: {
        "background": "color-mix(in oklab, var(--clampography-text) 20%, transparent)",
      },
      [scope("meter")]: {
        "background": "color-mix(in oklab, var(--clampography-text) 20%, transparent)",
      },
    },

    // Re-establish height context for WebKit shadow DOM
    // appearance:none breaks Chrome's flex layout; inner elements can't resolve height:100%
    // without a concrete parent height set here.
    // display:flex + align-items:stretch forces the child bar to fill the full height
    // without top-anchoring it the way display:block would.
    [scope("meter::-webkit-meter-inner-element")]: {
      "display": "flex",
      "align-items": "stretch",
      "height": "1em",
    },

    // WebKit inner track
    [scope("meter::-webkit-meter-bar")]: {
      "background": "color-mix(in oklab, var(--clampography-text) 20%, transparent)",
      "height": "100%",
    },

    // 1. Optimum (Success)
    [scope("meter::-webkit-meter-optimum-value")]: {
      "background": "var(--clampography-success)",
      "height": "100%",
    },
    [scope("meter:-moz-meter-optimum::-moz-meter-bar")]: {
      "background": "var(--clampography-success)",
    },

    // 2. Sub-optimum (Warning)
    [scope("meter::-webkit-meter-suboptimum-value")]: {
      "background": "var(--clampography-warning)",
      "height": "100%",
    },
    [scope("meter:-moz-meter-sub-optimum::-moz-meter-bar")]: {
      "background": "var(--clampography-warning)",
    },

    // 3. Even less good (Error)
    [scope("meter::-webkit-meter-even-less-good-value")]: {
      "background": "var(--clampography-error)",
      "height": "100%",
    },
    [scope("meter:-moz-meter-sub-sub-optimum::-moz-meter-bar")]: {
      "background": "var(--clampography-error)",
    },

  };
};
