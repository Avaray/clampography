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
    // PRINT OPTIMIZATION: Force clean, ink-friendly output for printing and PDF export.
    // Overrides all theme colors, removes backgrounds, and converts fluid vw units to
    // static sizes so text renders correctly on physical paper (A4/Letter).
    "@media print": {
      [(() => {
        const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
        const bodyBase = root === ":root" ? "body" : root;
        return typographyPrefix ? `${bodyBase}${typographyPrefix}` : bodyBase;
      })()]: {
        // Static sizes — vw-based clamp() is meaningless on paper
        "font-size": "12pt",
        "line-height": "1.6",
        // Force black-on-white for max legibility and ink saving
        "color": "black",
        "background": "white",
        // Disable all transitions
        "transition": "none",
      },
      [scope(":where(h1, h2, h3, h4, h5, h6)")]: {
        "color": "black",
        "page-break-after": "avoid",
      },
      [scope("h1")]: { "font-size": "28pt" },
      [scope("h2")]: { "font-size": "22pt" },
      [scope("h3")]: { "font-size": "18pt" },
      [scope("h4")]: { "font-size": "14pt" },
      [scope("h5")]: { "font-size": "12pt" },
      [scope("h6")]: { "font-size": "11pt" },
      [scope("a")]: {
        // Force readable link styling on paper
        "color": "black",
        "text-decoration": "underline",
      },
      [scope("pre, blockquote")]: {
        // Avoid cutting code blocks and blockquotes across page breaks
        "page-break-inside": "avoid",
        "border": "1px solid #ccc",
        "background": "#f5f5f5",
      },
      [scope("table")]: {
        "page-break-inside": "avoid",
        "border": "1px solid #ccc",
      },
      [scope("th, td")]: {
        "border": "1px solid #ccc",
      },
      [scope("img, figure")]: {
        // Prevent images from overflowing the page
        "max-width": "100%",
        "page-break-inside": "avoid",
      },
      // Lists (neutralize extra.js colors and ensure visibility)
      [scope("ul > li::before")]: {
        "background-color": "#555",
        "print-color-adjust": "exact",
        "-webkit-print-color-adjust": "exact",
      },
      [scope("ol > li::before")]: {
        "color": "#555",
      },
      // Inline Code & Pre (neutralize extra.js & base.js backgrounds)
      [scope(":where(code:not(pre code), kbd, samp)")]: {
        "background-color": "transparent",
        "color": "black",
        "border-color": "#ccc",
      },
      // Mark & Del (neutralize extra.js colors)
      [scope("mark")]: {
        "background-color": "transparent",
        "color": "black",
        "border": "1px solid #ccc",
      },
      [scope("del")]: {
        "text-decoration-color": "black",
      },
      // Blockquote (neutralize extra.js inline start color)
      [scope("blockquote")]: {
        "border-inline-start-color": "#ccc",
        "color": "black",
      },
      // Captions & Muted (neutralize extra.js colors)
      [scope("caption, figcaption, .muted")]: {
        "color": "#666",
      },
      // HR, Details & Summary (neutralize extra.js colors)
      [scope("hr")]: {
        "background-color": "#ccc",
        "border-color": "#ccc",
      },
      [scope("details")]: {
        "border-color": "#ccc",
      },
      [scope("summary")]: {
        "color": "black",
      },
      // Forms (neutralize forms.js backgrounds and borders)
      [scope(":where(input, textarea, select, button, [type='button'], [type='reset'], [type='submit'])")]: {
        "background-color": "transparent",
        "color": "black",
        "border-color": "#ccc",
      },
      [scope(":where(input, textarea, select):focus-visible")]: {
        "box-shadow": "none",
        "outline": "none",
      },
    },
  };
};
