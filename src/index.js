import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import baseStyles from "./base.js";
import extraStyles from "./extra.js";

/**
 * Main plugin function.
 */
export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Load Base and Extra styles
    const includeBase = options.base ?? true;
    const includeExtra = options.extra ?? false;

    if (includeBase) addBase(baseStyles);
    if (includeExtra) addBase(extraStyles);

    // 2. Parse themes configuration
    let configThemes = options.themes;

    // Default values
    let themesToInclude = [];
    let defaultThemeName = "light";
    let prefersDarkTheme = false;
    let rootSelector = options.root ?? ":root";

    // Normalize input to an array of strings
    // CSS might pass this as a single long string separated by commas
    let rawThemeList = [];

    if (typeof configThemes === "string") {
      if (configThemes.trim() === "all") {
        // Special case: themes: all
        rawThemeList = Object.keys(builtInThemes);
      } else if (configThemes.trim() === "false") {
        rawThemeList = [];
      } else {
        // Split by comma: "light --default, dark --prefersdark"
        rawThemeList = configThemes.split(",");
      }
    } else if (Array.isArray(configThemes)) {
      rawThemeList = configThemes;
    } else {
      // Default fallback if nothing provided
      rawThemeList = ["light", "dark"];
    }

    // 3. Process the list and look for flags (--default, --prefersdark)
    // If "all" was used, we don't look for flags (we use default light/dark logic) unless implemented otherwise.
    // Here we focus on the explicit list.

    rawThemeList.forEach((rawItem) => {
      let themeName = rawItem.trim();

      // Ignore empty entries
      if (!themeName) return;

      // Check for --default flag
      if (themeName.includes("--default")) {
        themeName = themeName.replace("--default", "").trim();
        defaultThemeName = themeName;
      }

      // Check for --prefersdark flag (case insensitive just in case)
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
    if (themesToInclude.length === 0) return;

    // 4. Generate CSS
    const themeStyles = {};

    // A. Default theme (:root)
    if (builtInThemes[defaultThemeName]) {
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
