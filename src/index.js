import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import baseStyles from "./base.js";
import extraStyles from "./extra.js";

// Import version from package.json
import { version } from "../package.json" with { type: "json" };

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
export default plugin.withOptions(
  (() => {
    let firstRun = true; // Track first run for logging

    return (options = {}) => {
      return ({ addBase }) => {
        // Extract logs option (default: true)
        const showLogs = resolveBool(options.logs, true);

        // Show startup log only once
        if (showLogs && firstRun) {
          console.log(`🍀 Clampography v${version} loaded successfully`);
          firstRun = false;
        }

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
        let isAllThemes = false; // Track if user specified "all"

        // Normalize input to an array of strings
        let rawThemeList = [];
        if (typeof configThemes === "string") {
          if (["all", "true", "yes"].includes(configThemes.trim())) {
            // Special case: themes: all
            isAllThemes = true;
            rawThemeList = Object.keys(builtInThemes);
          } else if (["false", "none", "no"].includes(configThemes.trim())) {
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

        // 4. Auto-configure defaults for "themes: all"
        // If user didn't specify --default or --prefersdark flags,
        // automatically set light as default and dark for prefers-color-scheme
        if (isAllThemes) {
          if (!defaultThemeName && themesToInclude.includes("light")) {
            defaultThemeName = "light";
          }

          if (!prefersDarkTheme && themesToInclude.includes("dark")) {
            prefersDarkTheme = "dark";
          }
        }

        // 5. Generate CSS
        const themeStyles = {};

        // A. Default theme - uses :where() for lower specificity
        if (defaultThemeName && builtInThemes[defaultThemeName]) {
          const defaultSelector =
            `:where(${rootSelector}),[data-theme="${defaultThemeName}"]`;
          themeStyles[defaultSelector] = builtInThemes[defaultThemeName];
        }

        // B. Theme for prefers-color-scheme: dark - only applies to root selector
        if (prefersDarkTheme && builtInThemes[prefersDarkTheme]) {
          themeStyles["@media (prefers-color-scheme: dark)"] = {
            [rootSelector]: builtInThemes[prefersDarkTheme],
          };
        }

        // C. All themes available via [data-theme] attribute
        // WITH higher specificity to override media query
        themesToInclude.forEach((themeName) => {
          // Skip if already added as default (to avoid duplication)
          if (themeName === defaultThemeName) return;

          const selector =
            `html[data-theme="${themeName}"], [data-theme="${themeName}"]`;
          themeStyles[selector] = builtInThemes[themeName];
        });

        // ✅ D. CRITICAL: Override media query with data-theme selectors
        // This ensures manual theme selection always wins over system preference
        if (prefersDarkTheme) {
          themeStyles["@media (prefers-color-scheme: dark)"] = {
            ...themeStyles["@media (prefers-color-scheme: dark)"],
          };

          // Add all themes inside media query to override the :root rule
          themesToInclude.forEach((themeName) => {
            if (themeName === prefersDarkTheme) return; // Skip the prefersDark theme itself

            const selector =
              `html[data-theme="${themeName}"], [data-theme="${themeName}"]`;

            // Add inside media query
            if (!themeStyles["@media (prefers-color-scheme: dark)"][selector]) {
              themeStyles["@media (prefers-color-scheme: dark)"][selector] =
                builtInThemes[themeName];
            }
          });
        }

        addBase(themeStyles);
      };
    };
  })(),
  // Theme extension - enables utilities like bg-surface, text-heading, etc.
  (options = {}) => {
    // ✅ Extract prefix option (default: "clampography")
    // This prefix is ONLY used for Tailwind utility classes (e.g., bg-clampography-primary)
    // CSS variables remain unchanged (always --clampography-*)
    const prefix = options.prefix ?? "clampography";

    // Helper to add prefix with separator
    const addPrefix = (name) => prefix ? `${prefix}-${name}` : name;

    return {
      theme: {
        extend: {
          colors: {
            [addPrefix("background")]: "var(--clampography-background)",
            [addPrefix("border")]: "var(--clampography-border)",
            [addPrefix("error")]: "var(--clampography-error)",
            [addPrefix("heading")]: "var(--clampography-heading)",
            [addPrefix("info")]: "var(--clampography-info)",
            [addPrefix("link")]: "var(--clampography-link)",
            [addPrefix("muted")]: "var(--clampography-muted)",
            [addPrefix("primary")]: "var(--clampography-primary)",
            [addPrefix("secondary")]: "var(--clampography-secondary)",
            [addPrefix("success")]: "var(--clampography-success)",
            [addPrefix("surface")]: "var(--clampography-surface)",
            [addPrefix("text")]: "var(--clampography-text)",
            [addPrefix("warning")]: "var(--clampography-warning)",
          },
        },
      },
    };
  },
);
