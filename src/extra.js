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

    const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";

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
    // Transition duration token — drives smooth color changes when the theme changes.
    // Scoped here (not in base.js) because transitions are an extra.js concern.
    // Users can override: :root { --clampography-transition-duration: 0ms; } to disable.
    [`:where(${root})`]: {
      "--clampography-transition-duration": "200ms",
    },

    // --- Basic Coloring & Font (with user-font priority) ---
    [(() => {
      const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
      const bodyBase = root === ":root" ? "body" : root;
      return typographyPrefix ? `${bodyBase}${typographyPrefix}` : bodyBase;
    })()]: {
      "background-color": "var(--clampography-background)",
      "color": "var(--clampography-text)",
      // --font-sans is Tailwind v4's way to expose the user's font choice.
      // If the user sets a font in their project, it wins. If not, fallback to clampography's system stack.
      "font-family": "var(--font-sans, var(--clampography-font-base))",
      // Smooth theme transitions: all color CSS variables animate when data-theme changes.
      // Duration is driven by the token set in base.js (default 200ms).
      // Automatically disabled by the prefers-reduced-motion media query in base.js.
      "transition-property": "color, background-color, border-color, text-decoration-color, fill, stroke",
      "transition-duration": "var(--clampography-transition-duration, 200ms)",
      "transition-timing-function": "ease",
    },

    [scope(":where(h1, h2, h3, h4, h5, h6)")]: {
      "color": "var(--clampography-heading)",
    },

    // Styled Links
    [scope("a")]: {
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

    [scope("a:hover")]: {
      "text-decoration-color": "var(--clampography-link)",
    },

    // Lists
    [scope("ul > li::before")]: {
      "background-color": "var(--clampography-primary)",
    },

    [scope("ol > li::before")]: {
      "color": "var(--clampography-primary)",
    },

    // Inline Code
    [scope(":where(code:not(pre code), kbd, samp)")]: {
      "background-color": "var(--clampography-surface)",
      "color": "var(--clampography-heading)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.25rem",
      "padding": "0.125rem var(--clampography-spacing-xs)",
      "white-space": "nowrap",
    },

    [scope("kbd")]: {
      transform: "translateY(-0.15em)",
    },

    // Preformatted Code Blocks
    [scope("pre")]: {
      "background-color": "var(--clampography-surface)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "padding": "var(--clampography-spacing-md)",
    },

    // Tables
    [scope("table")]: {
      "padding": "var(--clampography-spacing-sm)",
      "border": "1px solid var(--clampography-border)",
    },

    [scope("th")]: {
      "color": "var(--clampography-heading)",
    },

    [scope("th, td")]: {
      "border": "1px solid var(--clampography-border)",
    },

    [scope("thead th")]: {
      "border-bottom-width": "2px",
    },

    [scope("tbody tr:nth-child(even)")]: {
      "background-color": "var(--clampography-surface)",
    },

    // Captions & Muted
    [scope("caption, figcaption, .muted")]: {
      "color": "var(--clampography-muted)",
    },

    // Horizontal Rule
    [scope("hr")]: {
      "height": "1px",
      "border-width": "0",
      "margin-top": "var(--clampography-spacing-xl)",
      "margin-bottom": "var(--clampography-spacing-xl)",
      "background-color": "var(--clampography-border)",
    },

    // Blockquote
    [scope("blockquote")]: {
      "border-inline-start-width": "4px",
      "border-inline-start-color": "var(--clampography-primary)",
      "background-color": "var(--clampography-surface)",
      "padding": "var(--clampography-spacing-md)",
      "border-radius": "0.25rem",
      "font-style": "italic",
      "color": "var(--clampography-heading)",
    },

    // Mark
    [scope("mark")]: {
      "background-color": "var(--clampography-primary)",
      "color": "var(--clampography-background)",
      "padding": "0.125rem var(--clampography-spacing-xs)",
      "border-radius": "0.25rem",
    },

    // Deleted Text
    [scope("del")]: {
      "text-decoration-color": "var(--clampography-error)",
      "text-decoration-thickness": "2px",
    },

    // Details
    [scope("details")]: {
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "padding": "var(--clampography-spacing-sm)",
    },

    [scope("summary")]: {
      "color": "var(--clampography-heading)",
      "border-bottom": "0px solid var(--clampography-border)",
    },

    [scope("details[open] > summary")]: {
      "border-bottom-width": "1px",
      "padding-bottom": "var(--clampography-spacing-sm)",
    },

    // ACCESSIBILITY: Disable all transitions for users who prefer reduced motion.
    // Respects the OS-level "Reduce Motion" setting on macOS, Windows, iOS, and Android.
    // Placed here (not in base.js) because it targets the transitions added above.
    "@media (prefers-reduced-motion: reduce)": {
      [(() => {
        const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
        const bodyBase = root === ":root" ? "body" : root;
        return typographyPrefix ? `${bodyBase}${typographyPrefix}` : bodyBase;
      })()]: {
        "transition": "none",
        "--clampography-transition-duration": "0ms",
      },
    },

    // ACCESSIBILITY: High-contrast mode for users who need maximum legibility.
    // Triggered automatically by the OS "Increase Contrast" setting on macOS,
    // Windows High Contrast Mode, or Android's Accessibility settings.
    "@media (prefers-contrast: more)": {
      [(() => {
        const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
        const bodyBase = root === ":root" ? "body" : root;
        return typographyPrefix ? `${bodyBase}${typographyPrefix}` : bodyBase;
      })()]: {
        // Override theme colors with absolute black/white for maximum legibility
        "background-color": "white",
        "color": "black",
      },
      [scope(":where(h1, h2, h3, h4, h5, h6)")]: {
        "color": "black",
      },
      [scope("a")]: {
        "color": "black",
        "text-decoration": "underline",
        "text-decoration-thickness": "2px",
        "font-weight": "700",
      },
      [scope(":where(code:not(pre code), kbd, samp)")]: {
        "background-color": "#f0f0f0",
        "color": "black",
        "border": "2px solid black",
      },
      [scope("pre")]: {
        "background-color": "#f0f0f0",
        "color": "black",
        "border": "2px solid black",
      },
      [scope("blockquote")]: {
        "background-color": "#f0f0f0",
        "border-inline-start-color": "black",
        "border-inline-start-width": "6px",
        "color": "black",
      },
      [scope("th, td")]: {
        "border": "2px solid black",
      },
      [scope("hr")]: {
        "background-color": "black",
        "height": "2px",
      },
    },
  };
};
