import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import baseStyles from "./base.js";
import extraStyles from "./extra.js";

/**
 * Main plugin function.
 *
 * @param {Object} options
 * @param {Array<string>|string} [options.themes=["light", "dark"]]
 * @param {string} [options.defaultTheme="light"]
 * @param {string|boolean} [options.prefersDark=false]
 * @param {string} [options.root=":root"]
 * @param {boolean} [options.base=true]
 * @param {boolean} [options.extra=false]
 */
export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Set configuration defaults
    const configThemes = options.themes ?? ["light", "dark"];
    const defaultThemeName = options.defaultTheme ?? "light";
    const prefersDarkTheme = options.prefersDark ?? false;
    const rootSelector = options.root ?? ":root";
    const includeBase = options.base ?? true;
    const includeExtra = options.extra ?? false;

    // 2. Inject Base Styles (if enabled)
    // baseStyles is already a JS object, so addBase accepts it directly.
    if (includeBase) {
      addBase(baseStyles);
    }

    // 3. Inject Extra Styles (if enabled)
    if (includeExtra) {
      addBase(extraStyles);
    }

    // 4. Determine themes to include
    let themesToInclude = [];

    if (configThemes === "all") {
      themesToInclude = Object.keys(builtInThemes);
    } else if (Array.isArray(configThemes)) {
      themesToInclude = configThemes.filter((name) => builtInThemes[name]);
    } else if (configThemes === "false") {
      themesToInclude = [];
    }

    // Stop if no themes are requested
    if (
      themesToInclude.length === 0 && configThemes !== "all" &&
      (!Array.isArray(configThemes) || configThemes.length === 0)
    ) {
      return;
    }

    const themeStyles = {};

    // 5. Generate Default Theme
    if (builtInThemes[defaultThemeName]) {
      themeStyles[rootSelector] = builtInThemes[defaultThemeName];
    }

    // 6. Handle Dark Mode preference
    if (prefersDarkTheme && builtInThemes[prefersDarkTheme]) {
      themeStyles["@media (prefers-color-scheme: dark)"] = {
        [rootSelector]: builtInThemes[prefersDarkTheme],
      };
    }

    // 7. Generate Data Attribute Themes
    themesToInclude.forEach((themeName) => {
      themeStyles[`[data-theme="${themeName}"]`] = builtInThemes[themeName];
    });

    // 8. Inject Theme Variables
    addBase(themeStyles);
  };
});
