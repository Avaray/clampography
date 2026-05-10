import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { themesList } from "../src/themes.js";

const PORT = 3000;

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    // Serve HTML
    if (url.pathname === "/") {
      try {
        let html = readFileSync(join(import.meta.dir, "index.html"), "utf8");
        // Inject themesList dynamically
        html = html.replace(
          'const AVAILABLE_THEMES = [];',
          `const AVAILABLE_THEMES = ${JSON.stringify(themesList)};`
        );
        
        // Inject package version
        const pkg = JSON.parse(readFileSync(join(import.meta.dir, "../package.json"), "utf8"));
        html = html.replace('vX.X.X', `v${pkg.version}`);
        
        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      } catch (e) {
        return new Response("Error reading index.html", { status: 500 });
      }
    }

    // Serve CSS
    if (url.pathname === "/output.css") {
      const cssPath = join(import.meta.dir, "output.css");
      if (existsSync(cssPath)) {
        return new Response(readFileSync(cssPath, "utf8"), {
          headers: { "Content-Type": "text/css" },
        });
      }
      return new Response("CSS not found. Is Tailwind running?", { status: 404 });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`🚀 Clampography Dev Server running at http://localhost:${PORT}`);
console.log(`🎨 Dynamic themes loaded from src/themes.js: ${themesList.join(', ')}`);
