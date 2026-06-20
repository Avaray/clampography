export default (options = {}) => {
  const root = options.root || ":root";

  // Apply scrollbar-color to the scrolling container.
  // For :root, this means html. For a custom root (e.g. #app), apply to that element.
  const typographyPrefix = options.typography && options.typography !== "global" ? ` ${options.typography}` : "";
  const baseSelector = root === ":root" ? "html" : root;
  const containerSelector = typographyPrefix ? `${baseSelector}${typographyPrefix}` : baseSelector;

  return {
    // CSS Scrollbars (W3C standard — Chrome 121+, Firefox 64+, Edge 121+, Safari 17.2+)
    // Only colors are modified. The browser preserves its own OS-native scrollbar thickness.
    // Older browsers silently ignore these properties — no custom scrollbar, no broken layout.
    [containerSelector]: {
      "scrollbar-color": "var(--clampography-border) var(--clampography-background)",
      "scrollbar-width": "auto",
    },
  };
};
