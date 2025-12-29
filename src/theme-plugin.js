import plugin from "tailwindcss/plugin";

// List of required color keys for validation (optional but good practice)
const REQUIRED_KEYS = [
  "--clampography-background",
  "--clampography-text",
  "--clampography-link",
  "--clampography-primary",
  "--clampography-secondary",
];

export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Extract metadata
    const themeName = options.name;
    const isDefault = options.default ?? false;
    const isPrefersDark = options.prefersdark ?? false; // lowercase because CSS might force it
    const rootSelector = options.root ?? ":root";

    if (!themeName) {
      console.warn("Clampography: Theme definition missing 'name' property.");
      return;
    }

    // 2. Extract colors from options
    // We iterate over the options object and pick anything that looks like our CSS variable
    // or simply take all known keys.
    const themeColors = {};

    // You can also support short aliases here if you want (e.g., 'primary' -> '--clampography-primary')
    // For now, let's assume user passes full variable names or mapped keys.

    // Helper to map simplified keys to full CSS vars (optional convenience)
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

    Object.keys(options).forEach((key) => {
      // Check if it's one of our mapped short keys
      if (keyMap[key]) {
        themeColors[keyMap[key]] = options[key];
      } // Or if it is already a custom property key (starts with --)
      else if (key.startsWith("--")) {
        themeColors[key] = options[key];
      }
    });

    // 3. Generate Styles
    const styles = {};

    // A. Define the theme as a named data-theme (always available)
    styles[`[data-theme="${themeName}"]`] = themeColors;

    // B. If marked as default, apply to :root
    if (isDefault) {
      styles[rootSelector] = themeColors;
    }

    // C. If marked as prefers-dark, apply to media query
    if (isPrefersDark) {
      styles["@media (prefers-color-scheme: dark)"] = {
        [rootSelector]: themeColors,
      };
    }

    addBase(styles);
  };
});
