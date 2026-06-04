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
    // PRINT OPTIMIZATION: Force clean, ink-friendly output for printing and PDF export.
    // Overrides all theme colors, removes backgrounds, and converts fluid vw units to
    // static sizes so text renders correctly on physical paper (A4/Letter).
    "@media print": {
      [root === ":root" ? "body" : root]: {
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
    },
  };
};
