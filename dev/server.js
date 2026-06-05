import { serve } from "bun";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { themes, themesList } from "../src/themes.js";

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

function makeInputCSS({ themes, extra, forms, kbd }) {
  return `@import "tailwindcss";
@plugin "../../src/index.js" {
  themes: ${themes};
  base: true;
  extra: ${extra};
  forms: ${forms};
  kbd: ${kbd};
}
`;
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
          `const AVAILABLE_THEMES = ["auto", ...${JSON.stringify(themesList)}];`
        );
        html = html.replace(
          "const THEME_DATA = {};",
          `const THEME_DATA = ${JSON.stringify(themes)};`
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
          const idx = themesList.indexOf(name);
          if (idx > -1) themesList.splice(idx, 1);
        } else if (action === "CREATE" || action === "UPDATE") {
          themes[name] = data;
          if (!themesList.includes(name)) {
            themesList.push(name);
            themesList.sort();
          }
        } else {
          return new Response("Invalid action", { status: 400 });
        }

        // Regenerate src/themes.js
        regenerateThemesFile();

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
  return str.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

// Function to regenerate src/themes.js
function regenerateThemesFile() {
  const THEMES_FILE = join(ROOT, "src", "themes.js");
  
  // Sort the themes alphabetically to keep the file clean
  const sortedNames = Object.keys(themes).sort();
  
  let content = `/**
 * Built-in Themes
 * 
 * Auto-generated by Clampography Dev Server.
 * Do not manually edit this file unless you know what you're doing.
 */

`;

  // Write individual theme exports
  for (const name of sortedNames) {
    const camel = toCamelCase(name);
    const themeObj = themes[name];
    
    content += `export const ${camel} = {\n`;
    
    // ensure color-scheme is first
    if (themeObj["color-scheme"]) {
      content += `  "color-scheme": "${themeObj["color-scheme"]}",\n`;
    }
    
    // sort variables alphabetically
    const keys = Object.keys(themeObj).filter(k => k !== "color-scheme").sort();
    for (const k of keys) {
      content += `  "${k}": "${themeObj[k]}",\n`;
    }
    content += `};\n\n`;
  }

  // Write the main themes export object
  content += `export const themes = {\n`;
  for (const name of sortedNames) {
    const camel = toCamelCase(name);
    content += `  "${name}": ${camel},\n`;
  }
  content += `};\n\n`;

  // Write the themesList export
  content += `export const themesList = Object.keys(themes);\n`;

  writeFileSync(THEMES_FILE, content, "utf8");
}

console.log(`🚀 Clampography Dev Server running at http://localhost:${PORT}`);
console.log(`🎨 Themes (${themesList.length}): ${themesList.join(", ")}`);
console.log(`🔀 ${COMBOS.length} CSS variants — suffix = t(hemes) e(xtra) f(orms) k(bd), e.g. /css/tefk.css`);
