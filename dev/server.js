import { serve } from "bun";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { themesList } from "../src/themes.js";

const PORT = 3000;
const DIR = import.meta.dir;
const ROOT = join(DIR, "..");
const CSS_DIR = join(DIR, "css");

// Ensure css dir exists
if (!existsSync(CSS_DIR)) {
  import("fs").then(fs => fs.mkdirSync(CSS_DIR, { recursive: true }));
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
  fetch(req) {
    const url = new URL(req.url);

    // Serve HTML
    if (url.pathname === "/") {
      try {
        let html = readFileSync(join(DIR, "index.html"), "utf8");
        html = html.replace(
          "const AVAILABLE_THEMES = [];",
          `const AVAILABLE_THEMES = ${JSON.stringify(themesList)};`
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

    return new Response("Not found", { status: 404 });
  },
});

console.log(`🚀 Clampography Dev Server running at http://localhost:${PORT}`);
console.log(`🎨 Themes (${themesList.length}): ${themesList.join(", ")}`);
console.log(`🔀 ${COMBOS.length} CSS variants — suffix = t(hemes) e(xtra) f(orms) k(bd), e.g. /css/tefk.css`);
