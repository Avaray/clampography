import { serve } from "bun";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { themesList } from "../src/themes.js";

const PORT = 3000;
const DIR = import.meta.dir;
const ROOT = join(DIR, "..");

// 4 pre-built CSS combos: themes x extra
// suffix: t=themes, e=extra, n=none
const COMBOS = [
  { suffix: "te", themes: "all",   extra: "true"  },
  { suffix: "t",  themes: "all",   extra: "false" },
  { suffix: "e",  themes: "false", extra: "true"  },
  { suffix: "n",  themes: "false", extra: "false" },
];

function makeInputCSS(themes, extra) {
  return `@import "tailwindcss";
@plugin "../src/index.js" {
  themes: ${themes};
  base: true;
  extra: ${extra};
}
`;
}

async function buildCombo({ suffix, themes, extra }) {
  const inputPath  = join(DIR, `_input_${suffix}.css`);
  const outputPath = join(DIR, `_output_${suffix}.css`);

  writeFileSync(inputPath, makeInputCSS(themes, extra));

  // Use the locally installed tailwindcss binary
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
    console.error(`❌ Failed to build ${suffix}:`, err);
  }
  return outputPath;
}

// Build all 4 combos in parallel on startup
console.log("⚙️  Pre-building 4 CSS variants (themes × extra)...");
const start = Date.now();
await Promise.all(COMBOS.map(buildCombo));
console.log(`✅ All variants built in ${Date.now() - start}ms`);

// Load all variants into memory for zero-latency serving
const cssCache = {};
for (const { suffix } of COMBOS) {
  const p = join(DIR, `_output_${suffix}.css`);
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

    // Serve pre-built CSS variants: /css/te.css, /css/t.css, /css/e.css, /css/n.css
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
console.log(`🔀 CSS variants served at /css/te.css | /css/t.css | /css/e.css | /css/n.css`);
