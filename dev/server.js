import { serve } from "bun";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { themes as officialThemes, themesList as officialThemesList } from "../src/themes.js";
import { themes as devThemes, themesList as devThemesList } from "./themes-dev.js";

const themes = { ...devThemes, ...officialThemes };
const themesList = Object.keys(themes).sort();


const PORT = 3000;
const DIR = import.meta.dir;
const ROOT = join(DIR, "..");
const CSS_DIR = join(DIR, "css");

// Ensure css dir exists
if (!existsSync(CSS_DIR)) {
  mkdirSync(CSS_DIR, { recursive: true });
}

// 16 pre-built CSS combos: themes × extra × forms × kbd
// suffix letters: t=themes, e=extra, f=forms, k=kbd, n=none (all off)
function buildCombos() {
  const flags = [
    { key: "t", opt: "themes",  on: "all",   off: "false" },
    { key: "e", opt: "extra",   on: "true",  off: "false" },
    { key: "f", opt: "forms",   on: "true",  off: "false" },
    { key: "k", opt: "kbd",     on: "true",  off: "false" },
  ];

  const combos = [];

  // 2^4 = 16 combinations
  for (let mask = 0; mask < 16; mask++) {
    const suffix = flags
      .filter((_, i) => (mask >> (flags.length - 1 - i)) & 1)
      .map((f) => f.key)
      .join("") || "n";

    const opts = Object.fromEntries(
      flags.map((f, i) => [f.opt, (mask >> (flags.length - 1 - i)) & 1 ? f.on : f.off])
    );

    combos.push({ suffix, ...opts });
  }

  return combos;
}

const COMBOS = buildCombos();

function makeInputCSS({ themes: enableThemes, extra, forms, kbd }) {
  let css = `@import "tailwindcss";
@plugin "../../src/index.js" {
  themes: ${enableThemes};
  base: true;
  extra: ${extra};
  forms: ${forms};
  kbd: ${kbd};
}
`;
  
  // Inject all themes (dev and official) as raw CSS so they are available in dev preview
  // without relying on Tailwind plugin cache to reload src/themes.js
  if (enableThemes !== "false") {
    const allThemes = { ...devThemes, ...officialThemes };
    for (const name of Object.keys(allThemes)) {
      // Double the attribute selector to force higher specificity (0,2,1) vs plugin's (0,1,1).
      // This ensures dev injected CSS always overrides cached plugin output, even if 
      // Tailwind sorts the plugin's @media queries to the very end of the file.
      css += `\nhtml[data-theme="${name}"][data-theme="${name}"], [data-theme="${name}"][data-theme="${name}"] {\n`;
      for (const [k, v] of Object.entries(allThemes[name])) {
        if (k !== "color-scheme") css += `  ${k}: ${v};\n`;
      }
      css += `}\n`;
    }
  }

  return css;
}

async function buildCombo(combo) {
  const inputPath  = join(CSS_DIR, `_input_${combo.suffix}.css`);
  const outputPath = join(CSS_DIR, `_output_${combo.suffix}.css`);

  writeFileSync(inputPath, makeInputCSS(combo));

  const bin = process.platform === "win32"
    ? join(ROOT, "node_modules/.bin/tailwindcss.exe")
    : join(ROOT, "node_modules/.bin/tailwindcss");

  const proc = Bun.spawn([bin, "-i", inputPath, "-o", outputPath], {
    cwd: ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const err = await new Response(proc.stderr).text();
    console.error(`❌ Failed to build ${combo.suffix}:`, err);
  }
  return outputPath;
}

// Build all combos in parallel on startup
console.log(`⚙️  Pre-building ${COMBOS.length} CSS variants (themes × extra × forms × kbd)...`);
const start = Date.now();
await Promise.all(COMBOS.map(buildCombo));
console.log(`✅ All variants built in ${Date.now() - start}ms`);

// Load all variants into memory for zero-latency serving
const cssCache = {};
for (const { suffix } of COMBOS) {
  const p = join(CSS_DIR, `_output_${suffix}.css`);
  cssCache[suffix] = existsSync(p) ? readFileSync(p, "utf8") : "/* build failed */";
}

// Also load package version once
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve HTML
    if (url.pathname === "/") {
      try {
        let html = readFileSync(join(DIR, "index.html"), "utf8");
        html = html.replace(
          "const AVAILABLE_THEMES = [];",
          `const AVAILABLE_THEMES = ${JSON.stringify(themesList)};`
        );
        html = html.replace(
          "const THEME_DATA = {};",
          `const THEME_DATA = ${JSON.stringify(themes)};`
        );
        html = html.replace(
          "const OFFICIAL_THEMES = [];",
          `const OFFICIAL_THEMES = ${JSON.stringify(officialThemesList)};`
        );
        html = html.replace("vX.X.X", `v${pkg.version}`);
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch (e) {
        return new Response("Error reading index.html", { status: 500 });
      }
    }

    // Serve pre-built CSS variants: /css/tefk.css, /css/te.css, /css/n.css, etc.
    const cssMatch = url.pathname.match(/^\/css\/(\w+)\.css$/);
    if (cssMatch) {
      const suffix = cssMatch[1];
      if (cssCache[suffix] !== undefined) {
        return new Response(cssCache[suffix], {
          headers: { "Content-Type": "text/css", "Cache-Control": "no-cache" },
        });
      }
    }

    // API Endpoint for Theme CRUD
    if (url.pathname === "/api/themes" && req.method === "POST") {
      try {
        const body = await req.json();
        const { action, name, data } = body;

        if (!name) return new Response("Missing theme name", { status: 400 });

        if (action === "DELETE") {
          delete themes[name];
          delete devThemes[name];
          delete officialThemes[name];
          const idx = themesList.indexOf(name);
          if (idx > -1) themesList.splice(idx, 1);
        } else if (action === "CREATE" || action === "UPDATE") {
          const { oldName } = body;
          
          if (oldName && oldName !== name) {
            // Delete old theme entirely
            delete themes[oldName];
            delete devThemes[oldName];
            delete officialThemes[oldName];
            const idx = themesList.indexOf(oldName);
            if (idx > -1) themesList.splice(idx, 1);
          }

          themes[name] = data;
          if (!themesList.includes(name)) {
            themesList.push(name);
            themesList.sort();
          }

          // If renaming an official theme, keep it official. Otherwise dev.
          if (officialThemes.hasOwnProperty(name) || (oldName && officialThemes.hasOwnProperty(oldName))) {
            officialThemes[name] = data;
          } else {
            devThemes[name] = data;
          }
        } else if (action === "PUBLISH") {
          if (devThemes[name]) {
            officialThemes[name] = devThemes[name];
            delete devThemes[name];
          }
        } else if (action === "UNPUBLISH") {
          if (officialThemes[name]) {
            devThemes[name] = officialThemes[name];
            delete officialThemes[name];
          }
        } else {
          return new Response("Invalid action", { status: 400 });
        }

        // Regenerate both files
        regenerateOfficialThemesFile();
        regenerateDevThemesFile();

        // Rebuild CSS
        console.log(`\n⚙️  Re-building CSS variants after theme update...`);
        const start = Date.now();
        await Promise.all(COMBOS.map(buildCombo));
        for (const { suffix } of COMBOS) {
          const p = join(CSS_DIR, `_output_${suffix}.css`);
          cssCache[suffix] = existsSync(p) ? readFileSync(p, "utf8") : "/* build failed */";
        }
        console.log(`✅ All variants rebuilt in ${Date.now() - start}ms`);

        return new Response(JSON.stringify({ success: true, themesList }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        console.error("API Error:", e);
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

// Helper to convert kebab-case to camelCase (handles digits: synthwave-84 → synthwave84)
function toCamelCase(str) {
  let camel = str.replace(/-([a-z0-9])/gi, (_, char) => char.toUpperCase());
  if (/^[0-9]/.test(camel)) {
    camel = "_" + camel;
  }
  return camel;
}

// Function to regenerate src/themes.js (Official)
function regenerateOfficialThemesFile() {
  const THEMES_FILE = join(ROOT, "src", "themes.js");
  
  const sortedNames = Object.keys(officialThemes).sort();
  
  let content = `/**
 * Built-in Themes
 * 
 * Auto-generated by Clampography Dev Server.
 * Do not manually edit this file unless you know what you're doing.
 */\n\n`;

  for (const name of sortedNames) {
    const camelName = toCamelCase(name);
    content += `export const ${camelName} = {\n`;
    
    const themeData = officialThemes[name];
    if (themeData["color-scheme"]) {
      content += `  "color-scheme": "${themeData["color-scheme"]}",\n`;
    }
    
    for (const [key, value] of Object.entries(themeData)) {
      if (key === "color-scheme") continue;
      content += `  "${key}": "${value}",\n`;
    }
    
    content += `};\n\n`;
  }

  content += `export const themes = {\n`;
  for (let i = 0; i < sortedNames.length; i++) {
    const name = sortedNames[i];
    const camelName = toCamelCase(name);
    const comma = i < sortedNames.length - 1 ? "," : "";
    content += `  "${name}": ${camelName}${comma}\n`;
  }
  content += `};\n\n`;

  content += `export const themesList = Object.keys(themes);\n`;
  
  writeFileSync(THEMES_FILE, content);
  console.log("✅ Regenerated src/themes.js (Official Themes)");
}

// Function to regenerate dev/themes-dev.js (Experimental)
function regenerateDevThemesFile() {
  const THEMES_DEV_FILE = join(DIR, "themes-dev.js");
  
  const sortedNames = Object.keys(devThemes).sort();
  
  let content = `/**
 * Built-in Themes (Experimental / Dev Only)
 * 
 * Auto-generated by Clampography Dev Server.
 * Do not manually edit this file unless you know what you're doing.
 */\n\n`;

  for (const name of sortedNames) {
    const camelName = toCamelCase(name);
    content += `export const ${camelName} = {\n`;
    
    const themeData = devThemes[name];
    if (themeData["color-scheme"]) {
      content += `  "color-scheme": "${themeData["color-scheme"]}",\n`;
    }
    
    for (const [key, value] of Object.entries(themeData)) {
      if (key === "color-scheme") continue;
      content += `  "${key}": "${value}",\n`;
    }
    
    content += `};\n\n`;
  }

  content += `export const themes = {\n`;
  for (let i = 0; i < sortedNames.length; i++) {
    const name = sortedNames[i];
    const camelName = toCamelCase(name);
    const comma = i < sortedNames.length - 1 ? "," : "";
    content += `  "${name}": ${camelName}${comma}\n`;
  }
  content += `};\n\n`;

  content += `export const themesList = Object.keys(themes);\n`;
  
  writeFileSync(THEMES_DEV_FILE, content);
  console.log("✅ Regenerated dev/themes-dev.js (Experimental Themes)");
}

console.log(`🚀 Clampography Dev Server running at http://localhost:${PORT}`);
console.log(`🎨 Themes (${themesList.length}): ${themesList.join(", ")}`);
console.log(`🔀 ${COMBOS.length} CSS variants — suffix = t(hemes) e(xtra) f(orms) k(bd), e.g. /css/tefk.css`);
