import plugin from "tailwindcss/plugin";
import { themes as builtInThemes } from "./themes.js";
import baseStyles from "./base.js";
import extraStyles from "./extra.js";
import formsStyles from "./forms.js";
import kbdStyles from "./kbd.js";
import printStyles from "./print.js";

// Import version from package.json
import { version } from "../package.json" with { type: "json" };

/**
 * Helper to resolve boolean options from CSS configuration.
 * CSS values often come as strings ("true"/"false"), which are both truthy in JS.
 */
const resolveBool = (value, defaultValue) => {
  if (
    value === "false" || value === false || value === "no" || value === "none"
  ) return false;
  if (value === "true" || value === true || value === "yes") return true;
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
        const includeForms = resolveBool(options.forms, false); // Default: false
        const includeKbd = resolveBool(options.kbd, false);   // Default: false
        const includePrint = resolveBool(options.print, false); // Default: false

        // Extract fluid bounds for clampography math engine
        const fluidMin = parseInt(options["fluid-min"] || options.fluidMin || "320");
        const fluidMax = parseInt(options["fluid-max"] || options.fluidMax || "1280");

        // Extract typography scope option (default: global)
        const typography = options.typography || "global";

        // Pass options to the style functions to enable scoping
        includeBase && addBase(baseStyles({ ...options, fluidMin, fluidMax, typography }));
        includeExtra && addBase(extraStyles({ ...options, typography }));
        includeForms && addBase(formsStyles({ ...options, typography }));
        includeKbd && addBase(kbdStyles({ ...options, typography }));
        includePrint && addBase(printStyles({ ...options, typography }));

        // 2. Parse themes configuration
        let configThemes = options.themes;
        let themesToInclude = [];
        let defaultThemeName = null;
        let prefersDarkTheme = false;
        let rootSelector = options.root || ":root";
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

        // 4. Auto-configure defaults for "themes: all"
        if (isAllThemes) {
          if (!defaultThemeName) {
            if (themesToInclude.includes("light")) {
              defaultThemeName = "light";
            } else if (themesToInclude.length > 0) {
              defaultThemeName = themesToInclude[0];
            }
          }
          if (!prefersDarkTheme && themesToInclude.includes("dark")) {
            prefersDarkTheme = "dark";
          }
        }

        // LOGGING: Built-in themes summary
        if (showLogs) {
          const explicitlyDisabled = ["false", "no", "none"].includes(
            String(options.themes).trim(),
          );

          if (themesToInclude.length > 0) {
            const themesList = themesToInclude.map((theme) => {
              const flags = [];
              if (theme === defaultThemeName) flags.push("default");
              if (theme === prefersDarkTheme) flags.push("prefersdark");

              const flagStr = flags.length > 0 ? ` (${flags.join(", ")})` : "";
              return `${theme}${flagStr}`;
            });

            console.log(
              `🍀 Clampography: Loaded ${themesToInclude.length} built-in themes: ${
                themesList.join(", ")
              }`,
            );
          } else if (!explicitlyDisabled) {
            console.info("ℹ️ Clampography: No built-in themes loaded.");
          }
        }

        // Final check before generating CSS
        if (
          themesToInclude.length === 0 && !defaultThemeName && !prefersDarkTheme
        ) return;

        // 5. Generate CSS
        const themeStyles = {};

        // A. Default theme - uses :where() for lower specificity
        // Helper to combine root and data-theme
        // If root is ":root", we use "html[data-theme...]" for backwards compatibility.
        // If root is custom (e.g. "#morda"), we generate "#morda[data-theme...]"
        const getThemeSelector = (themeName) => {
          if (rootSelector === ":root") {
            return `html[data-theme="${themeName}"], [data-theme="${themeName}"]`;
          }
          // For custom root, attach data-theme directly to it
          // AND allow a nested data-theme inside it (optional, but good for nesting)
          return `${rootSelector}[data-theme="${themeName}"], ${rootSelector} [data-theme="${themeName}"]`;
        };

        // A. Default theme
        if (defaultThemeName && builtInThemes[defaultThemeName]) {
          // Default variables applied to the root element itself without data-theme attribute
          // uses :where() for lower specificity so it can be overridden
          const defaultSelector = `:where(${rootSelector})`;

          // Also apply if explicitly selected
          const explicitSelector = getThemeSelector(defaultThemeName);

          themeStyles[`${defaultSelector}, ${explicitSelector}`] =
            builtInThemes[defaultThemeName];
        }

        // B. Theme for prefers-color-scheme: dark
        if (prefersDarkTheme && builtInThemes[prefersDarkTheme]) {
          themeStyles["@media (prefers-color-scheme: dark)"] = {
            [rootSelector]: builtInThemes[prefersDarkTheme],
          };
        }

        // C. All themes available via [data-theme] attribute
        themesToInclude.forEach((themeName) => {
          if (themeName === defaultThemeName) return;
          const selector = getThemeSelector(themeName);
          themeStyles[selector] = builtInThemes[themeName];
        });

        // D. Override media query with data-theme selectors
        if (prefersDarkTheme) {
          themeStyles["@media (prefers-color-scheme: dark)"] = {
            ...themeStyles["@media (prefers-color-scheme: dark)"],
          };

          themesToInclude.forEach((themeName) => {
            if (themeName === prefersDarkTheme) return;
            const selector = getThemeSelector(themeName);

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
    const prefixEnabled = resolveBool(options.prefix, true);
    const prefix = prefixEnabled
      ? (typeof options.prefix === "string" &&
          !["false", "no", "none", "true"].includes(options.prefix)
        ? options.prefix
        : "clampography")
      : "";

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
