import { themes } from "./themes.js";

/**
 * CDN Theme Generator
 * Extracts light/dark themes from themes.js and structures them
 * for the Vanilla CSS build process.
 */
export default (options = {}) => {
  const root = options.root || ":root";
  const themeStyles = {};

  // 1. Default Theme (Light)
  if (themes["light"]) {
    // :where() lowers specificity so users can override it easily
    themeStyles[`:where(${root}), [data-theme="light"]`] = themes["light"];
  }

  // 2. Dark Mode (prefers-color-scheme)
  if (themes["dark"]) {
    themeStyles["@media (prefers-color-scheme: dark)"] = {
      // Default to dark if system prefers dark
      [root]: themes["dark"],
      // Keep data-theme="dark" inside media query for completeness
      [`[data-theme="dark"]`]: themes["dark"],
      // Allow overriding back to light even if system is dark
      [`[data-theme="light"]`]: themes["light"]
    };
    
    // 3. Explicit Data Theme (Dark) - works regardless of system preference
    themeStyles[`[data-theme="dark"]`] = themes["dark"];
  }

  return themeStyles;
};
