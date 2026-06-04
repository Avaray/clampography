import fs from "fs";
import { resolve } from "path";
import * as themes from "./themes.js";

const OUTPUT_DIR = "css";
const OUTPUT_FILE = "figma-tokens.json";

function exportTokens() {
  console.log("🎨 Starting Figma Design Tokens export...");
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const tokens = {};
  let themeCount = 0;

  for (const [themeName, themeData] of Object.entries(themes)) {
    // Figma convention: nested objects by theme name
    tokens[themeName] = {};
    themeCount++;
    
    for (const [key, value] of Object.entries(themeData)) {
      // Skip non-color attributes like color-scheme
      if (!key.startsWith("--clampography-")) continue;
      
      // Clean up the key name for Figma (e.g., "--clampography-primary" -> "primary")
      const colorName = key.replace("--clampography-", "");
      
      tokens[themeName][colorName] = {
        value: value,
        type: "color"
      };
    }
  }

  const outputPath = resolve(OUTPUT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), "utf-8");

  console.log(`✅ Successfully exported ${themeCount} themes to ${OUTPUT_DIR}/${OUTPUT_FILE}!`);
}

exportTokens();
