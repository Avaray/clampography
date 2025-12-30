import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";

export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Extract metadata
    const themeName = options.name;
    const isDefault = options.default ?? false;
    const isPrefersDark = options.prefersdark ?? false;
    const rootSelector = options.root ?? ":root";
    // Defaults to light scheme if not specified
    const colorScheme = options["color-scheme"] ?? "light";

    if (!themeName) {
      console.warn("Clampography: Theme definition missing 'name' property.");
      return;
    }

    // 2. Prepare Base Colors (Fallback)
    // We fetch the full palette of the requested color scheme (light/dark)
    // to fill in any missing gaps in the user's definition.
    const fallbackTheme = builtInThemes[colorScheme] || builtInThemes["light"];

    // 3. Extract & Merge Colors
    const themeColors = {};

    // Mapping of simplified keys to full CSS variable names
    const keyMap = {
      "background": "--clampography-background",
      "surface": "--clampography-surface",
      "border": "--clampography-border",
      "heading": "--clampography-heading",
      "text": "--clampography-text",
      "muted": "--clampography-muted",
      "link": "--clampography-link",
      "primary": "--clampography-primary",
      "secondary": "--clampography-secondary",
    };

    // First, populate with fallback colors
    Object.keys(fallbackTheme).forEach((key) => {
      themeColors[key] = fallbackTheme[key];
    });

    // Then override with user provided values
    Object.keys(options).forEach((key) => {
      // Ignore metadata keys
      if (
        ["name", "default", "prefersdark", "root", "color-scheme"].includes(key)
      ) return;

      if (keyMap[key]) {
        themeColors[keyMap[key]] = options[key];
      } else if (key.startsWith("--")) {
        themeColors[key] = options[key];
      }
    });

    // Add the CSS property 'color-scheme' for browser UI adaptation (scrollbars, etc.)
    themeColors["color-scheme"] = colorScheme;

    // 4. Generate Styles
    const styles = {};

    // A. Define the theme as a named data-theme
    styles[`[data-theme="${themeName}"]`] = themeColors;

    // B. If default, apply to root
    if (isDefault) {
      styles[rootSelector] = themeColors;
    }

    // C. If prefers-dark, apply to media query
    if (isPrefersDark) {
      styles["@media (prefers-color-scheme: dark)"] = {
        [rootSelector]: themeColors,
      };
    }

    addBase(styles);
  };
});
