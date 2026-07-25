export default (options = {}) => {
  const root = options.root || ":root";

  // Helper to scope selectors safely (same as base.js)
  const scope = (selector) => {
    const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
    
    // Global pseudo-elements like ::selection
    if (selector.startsWith("::selection")) {
      if (root === ":root" || root === "body") {
        return typographyPrefix ? `${typographyPrefix} ${selector}, ${typographyPrefix}${selector}` : selector;
      } else {
        return `${root} ${selector}, ${root}${selector}`;
      }
    }

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
        if (typographyPrefix) {
          return `${root}${typographyPrefix} ${part}`;
        }
        return `${root} ${part}`;
      })
      .join(", ");
  };

  return {
    // 1. Text Selection
    [scope("::selection")]: {
      "background-color": "color-mix(in oklch, var(--clampography-primary) 20%, transparent)",
      "color": "inherit",
    },

    // 2. <mark> Element (Highlighted text)
    [scope("mark")]: {
      "background-color": "color-mix(in oklch, var(--clampography-warning) 30%, transparent)",
      "color": "inherit",
      "padding": "0 0.1em",
      "border-radius": "2px",
    },

    // 3. Target Highlight (When navigating via #hash URL)
    [scope(":target")]: {
      "scroll-margin-top": "var(--clampography-scroll-offset, 5rem)",
      "animation": "clampography-target-fade 2s ease-out",
    },

    // 4. Target Animation Keyframes
    "@keyframes clampography-target-fade": {
      "0%": {
        "background-color": "color-mix(in oklch, var(--clampography-primary) 20%, transparent)",
        "box-shadow": "0 0 0 4px color-mix(in oklch, var(--clampography-primary) 20%, transparent)",
        "border-radius": "4px",
      },
      "100%": {
        "background-color": "transparent",
        "box-shadow": "0 0 0 4px transparent",
        "border-radius": "4px",
      }
    },

    // ACCESSIBILITY: Disable target animation for users who prefer reduced motion
    "@media (prefers-reduced-motion: reduce)": {
      [scope(":target")]: {
        "animation": "none",
      },
    },
  };
};
