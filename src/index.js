import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import baseStyles from "./base.js";
import extraStyles from "./extra.js";

/**
 * Helper to resolve boolean options from CSS configuration.
 * CSS values often come as strings ("true"/"false"), which are both truthy in JS.
 */
const resolveBool = (value, defaultValue) => {
  if (value === "false" || value === false) return false;
  if (value === "true" || value === true) return true;
  return defaultValue;
};

/**
 * Main plugin function.
 */
export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Load Base and Extra styles
    // We use the helper to correctly parse "false" string from CSS
    const includeBase = resolveBool(options.base, true); // Default: true
    const includeExtra = resolveBool(options.extra, false); // Default: false

    includeBase && addBase(baseStyles);
    includeExtra && addBase(extraStyles);

    // 2. Parse themes configuration
    let configThemes = options.themes;
    let themesToInclude = [];
    let defaultThemeName = null;
    let prefersDarkTheme = false;
    let rootSelector = options.root ?? ":root";

    // Normalize input to an array of strings
    let rawThemeList = [];

    if (typeof configThemes === "string") {
      if (configThemes.trim() === "all") {
        // Special case: themes: all
        rawThemeList = Object.keys(builtInThemes);
      } else if (configThemes.trim() === "false") {
        // Explicitly disabled themes
        rawThemeList = [];
      } else {
        rawThemeList = configThemes.split(",");
      }
    } else if (Array.isArray(configThemes)) {
      rawThemeList = configThemes;
    } else {
      // Default behavior: NO themes loaded automatically.
      // User must specify themes to load them.
      rawThemeList = [];
    }

    // 3. Process the list and look for flags (--default, --prefersdark)
    rawThemeList.forEach((rawItem) => {
      let themeName = rawItem.trim();

      // Ignore empty entries
      if (!themeName) return;

      // Check for --default flag
      if (themeName.includes("--default")) {
        themeName = themeName.replace("--default", "").trim();
        defaultThemeName = themeName;
      }

      // Check for --prefersdark flag
      if (themeName.toLowerCase().includes("--prefersdark")) {
        themeName = themeName.replace(/--prefersdark/i, "").trim();
        prefersDarkTheme = themeName;
      }

      // Check if theme exists in the database
      if (builtInThemes[themeName]) {
        themesToInclude.push(themeName);
      }
    });

    // If list is empty after filtering, stop here
    if (
      themesToInclude.length === 0 && !defaultThemeName && !prefersDarkTheme
    ) return;

    // 4. Generate CSS
    const themeStyles = {};

    // A. Default theme (:root)
    if (defaultThemeName && builtInThemes[defaultThemeName]) {
      themeStyles[rootSelector] = builtInThemes[defaultThemeName];
    }

    // B. Theme for prefers-color-scheme: dark
    if (prefersDarkTheme && builtInThemes[prefersDarkTheme]) {
      themeStyles["@media (prefers-color-scheme: dark)"] = {
        [rootSelector]: builtInThemes[prefersDarkTheme],
      };
    }

    // C. Scoped styles [data-theme="..."]
    themesToInclude.forEach((themeName) => {
      themeStyles[`[data-theme="${themeName}"]`] = builtInThemes[themeName];
    });

    addBase(themeStyles);
  };
});
