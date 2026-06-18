import fs from "fs";
import { resolve } from "path";
import { themes } from "./themes.js";

const OUTPUT_DIR = "css";
const OUTPUT_FILE = "figma-tokens.json";

/**
 * Converts an OKLCH color string to a hex color string.
 * Handles both percentage (oklch(10% 0 0)) and decimal (oklch(0.1 0 0)) lightness.
 */
function oklchToHex(oklchStr) {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)%?\s+([\d.e+-]+)\s+([\d.e+-]+)/i);
  if (!m) return "#000000";

  let L = parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const H = parseFloat(m[3]);

  // Normalize L to 0–1 if given as percentage
  if (L > 1) L = L / 100;

  // OKLCH → OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab → Linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  let r = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  let g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  let bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  // Linear sRGB → sRGB (gamma correction + clamp)
  const toSRGB = (c) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  r = toSRGB(r);
  g = toSRGB(g);
  bv = toSRGB(bv);

  const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bv)}`;
}

function exportTokens() {
  console.log("🎨 Starting Figma Design Tokens export...");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const tokens = {};
  let themeCount = 0;

  for (const [themeName, themeData] of Object.entries(themes)) {
    tokens[themeName] = {};
    themeCount++;

    for (const [key, value] of Object.entries(themeData)) {
      // Skip non-color attributes like color-scheme
      if (!key.startsWith("--clampography-")) continue;

      const colorName = key.replace("--clampography-", "");

      // W3C DTCG format: $value and $type (with $ prefix)
      tokens[themeName][colorName] = {
        $value: oklchToHex(value),
        $type: "color",
      };
    }
  }

  const outputPath = resolve(OUTPUT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), "utf-8");

  console.log(`✅ Successfully exported ${themeCount} themes to ${OUTPUT_DIR}/${OUTPUT_FILE}!`);
}

exportTokens();
