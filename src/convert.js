#!/usr/bin/env bun

/**
 * JS to CSS Converter for Bun.sh
 * Converts base.js to base.css and base.css.min (without comments)
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

// Configuration
const INPUT_FILE = "base.js";
const OUTPUT_FILE = "base.css";
const OUTPUT_MIN_FILE = "base.css.min";

/**
 * Import the JS module dynamically
 */
async function loadJSModule() {
  const module = await import(`./${INPUT_FILE}`);
  return module.default;
}

/**
 * Convert JS object to CSS string
 */
function toCSSString(obj, indent = 0) {
  const spaces = "  ".repeat(indent);
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      // It's a selector
      if (key === "@layer base") {
        // Special handling for @layer
        lines.push(`${spaces}@layer base {`);
        lines.push(toCSSString(value, indent + 1));
        lines.push(`${spaces}}`);
      } else {
        // Regular selector
        lines.push("");
        lines.push(`${spaces}${key} {`);

        // Process properties
        const properties = [];
        for (const [prop, val] of Object.entries(value)) {
          if (typeof val === "object") {
            // Nested selector - shouldn't happen but handle it
            lines.push(toCSSString({ [prop]: val }, indent + 1));
          } else {
            properties.push(`${spaces}  ${prop}: ${val};`);
          }
        }

        lines.push(...properties);
        lines.push(`${spaces}}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Convert JS object to minified CSS string
 */
function toMinifiedCSS(obj) {
  const parts = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      if (key === "@layer base") {
        parts.push("@layer base{");
        parts.push(toMinifiedCSS(value));
        parts.push("}");
      } else {
        // Regular selector
        const properties = [];
        for (const [prop, val] of Object.entries(value)) {
          if (typeof val === "object") {
            // Nested - handle recursively
            parts.push(toMinifiedCSS({ [prop]: val }));
          } else {
            properties.push(`${prop}:${val}`);
          }
        }

        if (properties.length > 0) {
          parts.push(`${key}{${properties.join(";")}}`);
        }
      }
    }
  }

  return parts.join("");
}

/**
 * Main conversion function
 */
async function convertJStoCSS() {
  try {
    console.log(`📖 Loading ${INPUT_FILE}...`);
    const jsObject = await loadJSModule();

    console.log("⚙️  Converting JS to CSS...");
    let cssContent = toCSSString(jsObject, 0);

    // Wrap in @layer base
    cssContent = `@layer base {${cssContent}\n}\n`;

    console.log(`💾 Writing ${OUTPUT_FILE}...`);
    writeFileSync(resolve(OUTPUT_FILE), cssContent, "utf-8");

    // Generate minified version
    console.log("⚙️  Generating minified CSS...");
    let minifiedContent = toMinifiedCSS(jsObject);

    // Wrap minified in @layer base
    minifiedContent = `@layer base{${
      minifiedContent.replace("@layer base{", "").replace(/}$/, "")
    }}`;

    console.log(`💾 Writing ${OUTPUT_MIN_FILE}...`);
    writeFileSync(resolve(OUTPUT_MIN_FILE), minifiedContent, "utf-8");

    console.log("✅ Conversion complete!");
    console.log(`📄 Output files:`);
    console.log(`   - ${OUTPUT_FILE}`);
    console.log(`   - ${OUTPUT_MIN_FILE}`);

    // Show file sizes
    const fs = await import("fs");
    const cssSize = fs.statSync(OUTPUT_FILE).size;
    const minSize = fs.statSync(OUTPUT_MIN_FILE).size;
    const reduction = ((1 - minSize / cssSize) * 100).toFixed(1);

    console.log(`📊 File sizes:`);
    console.log(`   - ${OUTPUT_FILE}: ${(cssSize / 1024).toFixed(2)} KB`);
    console.log(
      `   - ${OUTPUT_MIN_FILE}: ${
        (minSize / 1024).toFixed(2)
      } KB (${reduction}% smaller)`,
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run conversion
convertJStoCSS();
