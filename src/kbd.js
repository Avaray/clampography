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
      .filter(Boolean)
      .map((part) => {
        if (part === ":root" || part === "body") return root;
        return `${root} ${part}`;
      })
      .join(", ");
  };

  return {
    // ── <kbd> — 3D isometric keyboard key effect ──────────────────────────────
    //
    // The illusion is built from three layers:
    //   1. Key face  → background-color of the element itself
    //   2. Key depth → first box-shadow layer (the visible "side" of the key)
    //   3. Key cast  → second box-shadow layer (subtle drop shadow)
    //
    // rgba() overlays are used for the depth/cast so the effect adapts
    // automatically to any background (works on light AND dark themes).
    // Theme variables are used for the face/border when available.

    [scope("kbd")]: {
      "display": "inline-block",
      "padding": "0.1em 0.45em",
      "min-width": "1.7em",
      "text-align": "center",
      "font-size": "0.8em",
      "font-weight": "700",
      "line-height": "1.5",
      "white-space": "nowrap",
      "vertical-align": "0.1em",
      "cursor": "default",
      "user-select": "none",

      // Key face
      "background-color": "var(--clampography-surface, oklch(94% 0.004 264))",
      "color": "var(--clampography-text, oklch(18% 0.015 264))",

      // Key outline
      "border": "1px solid var(--clampography-border, oklch(76% 0.008 264))",
      "border-radius": "4px",

      // 3D depth layers:
      //   layer 1 — the key "body" (side face, seen in isometric view)
      //   layer 2 — the soft drop shadow beneath
      "box-shadow": [
        "0 2px 0 color-mix(in oklab, var(--clampography-border, oklch(60% 0.008 264)) 100%, black 18%)",
        "0 3px 2px rgba(0, 0, 0, 0.15)",
        "inset 0 1px 0 rgba(255, 255, 255, 0.5)",
      ].join(", "),

      "transition-property": "box-shadow, transform, border-bottom-width",
      "transition-duration": "80ms",
    },

    // Pressed state — key travels down by 2px
    [scope("kbd:active")]: {
      "transform": "translateY(2px)",
      "box-shadow": [
        "0 0 0 color-mix(in oklab, var(--clampography-border, oklch(60% 0.008 264)) 100%, black 18%)",
        "0 1px 1px rgba(0, 0, 0, 0.1)",
        "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      ].join(", "),
    },
  };
};
