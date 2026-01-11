import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import { sharedState } from "./shared-state.js";

export default plugin.withOptions((options = {}) => {
  return ({ addBase }) => {
    // 1. Extract metadata
    const themeName = options.name;
    const isDefault = options.default ?? false;
    const isPrefersDark = options.prefersdark ?? false;
    const rootSelector = options.root ?? ":root";
    const colorScheme = options["color-scheme"] ?? "light";

    // Check BOTH: local logs option AND shared state
    // Local option takes precedence if explicitly set
    const localLogs = options.logs;
    const showLogs = localLogs !== undefined
      ? (localLogs !== false)
      : sharedState.logsEnabled;

    if (!themeName) {
      if (showLogs) {
        console.warn(
          "🍀 Clampography: Theme definition missing 'name' property.",
        );
      }
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
      "border": "--clampography-border",
      "error": "--clampography-error",
      "heading": "--clampography-heading",
      "info": "--clampography-info",
      "link": "--clampography-link",
      "muted": "--clampography-muted",
      "primary": "--clampography-primary",
      "secondary": "--clampography-secondary",
      "success": "--clampography-success",
      "surface": "--clampography-surface",
      "text": "--clampography-text",
      "warning": "--clampography-warning",
    };

    // First, populate with fallback colors
    Object.keys(fallbackTheme).forEach((key) => {
      themeColors[key] = fallbackTheme[key];
    });

    // Then override with user provided values
    Object.keys(options).forEach((key) => {
      // Ignore metadata keys
      if (
        ["name", "default", "prefersdark", "root", "color-scheme", "logs"]
          .includes(key)
      ) return;

      const value = options[key];

      if (keyMap[key]) {
        // Validate color format (only if logs enabled)
        if (showLogs && value && typeof value === "string") {
          // Check if value starts with oklch() or is a valid CSS color
          const isOklch = value.trim().startsWith("oklch(");
          const isHex = /^#[0-9A-Fa-f]{3,8}$/.test(value.trim());
          const isRgb = value.trim().startsWith("rgb(") ||
            value.trim().startsWith("rgba(");

          if (!isOklch && !isHex && !isRgb) {
            console.warn(
              `Clampography (${themeName}): Color "${key}" has value "${value}" which may not be a valid color format. ` +
                `For best compatibility with opacity modifiers (e.g., bg-${key}/20), use full OKLCH format: ` +
                `oklch(70% 0.2 180) or oklch(0.7 0.2 180)`,
            );
          }

          if (isHex || isRgb) {
            console.info(
              `🍀 Clampography (${themeName}): Color "${key}" uses ${
                isHex ? "HEX" : "RGB"
              } format. ` +
                `Consider using OKLCH format for better color space support and smoother gradients.`,
            );
          }
        }

        themeColors[keyMap[key]] = value;
      } else if (key.startsWith("--")) {
        themeColors[key] = value;
      }
    });

    // Add the CSS property 'color-scheme' for browser UI adaptation (scrollbars, etc.)
    themeColors["color-scheme"] = colorScheme;

    // 4. Generate Styles
    const styles = {};

    // Build selector based on flags
    let selector = `[data-theme="${themeName}"]`;

    // If default, prepend :where(root) with lower specificity
    if (isDefault) {
      selector = `:where(${rootSelector}),${selector}`;
    }

    // Apply theme to the constructed selector
    styles[selector] = themeColors;

    // If prefers-dark, apply only to root selector in media query
    if (isPrefersDark) {
      styles["@media (prefers-color-scheme: dark)"] = {
        [rootSelector]: themeColors,
      };
    }

    addBase(styles);
  };
});
