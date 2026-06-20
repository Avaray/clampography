export default (options = {}) => {
  const root = options.root || ":root";

  // Helper to scope selectors safely (same as base.js)
  const scope = (selector) => {
    const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
    
    // For global scrollbars, if root is :root or body, we apply directly to the html/body 
    // or just generally to ::-webkit-scrollbar. 
    // If a custom root is specified (e.g. #app), we scope the scrollbar to that container.
    if (selector.startsWith("::-webkit-scrollbar")) {
      if (root === ":root" || root === "body") {
        return selector; // Apply globally
      } else {
        return `${root}${selector}, ${root} ${selector}`; // Apply to custom root and its children
      }
    }

    return selector;
  };

  return {
    // 1. Modern CSS Scrollbars (Firefox, modern Chrome/Edge)
    [(() => {
      // The scrollbar-color property must be applied to the scrolling container.
      // Usually this is html/body, but we respect the root setting.
      const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
      const baseSelector = root === ":root" ? "html" : root;
      return typographyPrefix ? `${baseSelector}${typographyPrefix}` : baseSelector;
    })()]: {
      "scrollbar-color": "var(--clampography-border) var(--clampography-background)",
      "scrollbar-width": "thin",
    },

    // 2. WebKit Scrollbars (older Chrome/Safari/Edge)
    [scope("::-webkit-scrollbar")]: {
      "width": "8px",
      "height": "8px",
    },

    [scope("::-webkit-scrollbar-track")]: {
      "background-color": "var(--clampography-background)",
    },

    [scope("::-webkit-scrollbar-thumb")]: {
      "background-color": "var(--clampography-border)",
      "border-radius": "4px",
    },

    [scope("::-webkit-scrollbar-thumb:hover")]: {
      "background-color": "var(--clampography-muted)",
    },
  };
};
