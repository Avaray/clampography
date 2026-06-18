import { themes } from "./themes.js";

/**
 * CDN Theme Generator
 * Extracts all themes from themes.js and structures them
 * for the Vanilla CSS build process.
 */
export default (options = {}) => {
  const root = options.root || ":root";
  const themeStyles = {};

  // 1. Default Theme (Light)
  if (themes["light"]) {
    // :where() lowers specificity so users can override it easily
    themeStyles[`:where(${root})`] = themes["light"];
  }

  // 2. Dark Mode (prefers-color-scheme)
  if (themes["dark"]) {
    themeStyles["@media (prefers-color-scheme: dark)"] = {
      // Default to dark if system prefers dark
      [root]: themes["dark"]
    };
  }

  // 3. Explicit Data Themes (Handles all themes, including light and dark)
  // Because these are generated after the media query, they have equal
  // specificity to :root but appear later in the CSS, thus overriding system preference.
  for (const [name, themeData] of Object.entries(themes)) {
    themeStyles[`[data-theme="${name}"]`] = themeData;
  }

  return themeStyles;
};
