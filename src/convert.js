#!/usr/bin/env bun

/**
 * JS to CSS Converter for Bun.sh
 * Converts multiple .js files to .css and .css.min
 */

import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { basename, resolve } from "path";

// Configuration
const FILES_TO_CONVERT = ["base.js", "extra.js"];
const OUTPUT_DIR = "css";

/**
 * Import the JS module dynamically
 */
async function loadJSModule(filePath) {
  const module = await import(`./${filePath}`);
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
 * Get output file names from input file name
 */
function getOutputFileNames(inputFile) {
  const baseNameWithoutExt = basename(inputFile, ".js");
  return {
    css: `${baseNameWithoutExt}.css`,
    min: `${baseNameWithoutExt}.css.min`,
  };
}

/**
 * Convert single JS file to CSS
 */
async function convertFile(inputFile) {
  const outputNames = getOutputFileNames(inputFile);
  const outputCSS = resolve(OUTPUT_DIR, outputNames.css);
  const outputMin = resolve(OUTPUT_DIR, outputNames.min);

  try {
    console.log(`\n📖 Loading ${inputFile}...`);
    const jsObject = await loadJSModule(inputFile);

    console.log(`⚙️  Converting to CSS...`);
    let cssContent = toCSSString(jsObject, 0);

    // Wrap in @layer base
    cssContent = `@layer base {${cssContent}\n}\n`;

    console.log(`💾 Writing ${outputNames.css}...`);
    writeFileSync(outputCSS, cssContent, "utf-8");

    // Generate minified version
    console.log(`⚙️  Generating minified version...`);
    let minifiedContent = toMinifiedCSS(jsObject);

    // Wrap minified in @layer base
    minifiedContent = `@layer base{${
      minifiedContent.replace("@layer base{", "").replace(/}$/, "")
    }}`;

    console.log(`💾 Writing ${outputNames.min}...`);
    writeFileSync(outputMin, minifiedContent, "utf-8");

    // Show file sizes
    const cssSize = statSync(outputCSS).size;
    const minSize = statSync(outputMin).size;
    const reduction = ((1 - minSize / cssSize) * 100).toFixed(1);

    console.log(`✅ ${inputFile} converted successfully!`);
    console.log(`   📄 ${outputNames.css}: ${(cssSize / 1024).toFixed(2)} KB`);
    console.log(
      `   📄 ${outputNames.min}: ${
        (minSize / 1024).toFixed(2)
      } KB (${reduction}% smaller)`,
    );

    return {
      input: inputFile,
      output: outputNames.css,
      outputMin: outputNames.min,
      cssSize,
      minSize,
      reduction,
    };
  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
    return null;
  }
}

/**
 * Main conversion function
 */
async function convertAllFiles() {
  console.log("🚀 Starting CSS conversion...");
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📝 Files to convert: ${FILES_TO_CONVERT.length}`);

  // Create output directory if it doesn't exist
  if (!existsSync(OUTPUT_DIR)) {
    console.log(`📁 Creating output directory: ${OUTPUT_DIR}`);
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  // Convert all files
  for (const file of FILES_TO_CONVERT) {
    const result = await convertFile(file);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 CONVERSION SUMMARY");
  console.log("=".repeat(60));

  if (results.length === 0) {
    console.log("❌ No files were converted successfully.");
    process.exit(1);
  }

  console.log(
    `✅ Successfully converted: ${results.length}/${FILES_TO_CONVERT.length} files\n`,
  );

  let totalCSSSize = 0;
  let totalMinSize = 0;

  results.forEach((result) => {
    console.log(`📄 ${result.input}`);
    console.log(
      `   → ${OUTPUT_DIR}/${result.output} (${
        (result.cssSize / 1024).toFixed(2)
      } KB)`,
    );
    console.log(
      `   → ${OUTPUT_DIR}/${result.outputMin} (${
        (result.minSize / 1024).toFixed(2)
      } KB, ${result.reduction}% smaller)`,
    );
    totalCSSSize += result.cssSize;
    totalMinSize += result.minSize;
  });

  const totalReduction = ((1 - totalMinSize / totalCSSSize) * 100).toFixed(1);

  console.log("\n" + "-".repeat(60));
  console.log(`📊 Total CSS size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
  console.log(`📊 Total Minified size: ${(totalMinSize / 1024).toFixed(2)} KB`);
  console.log(`📊 Total reduction: ${totalReduction}%`);
  console.log("=".repeat(60));
  console.log("🎉 All conversions completed!");
}

// Run conversion
convertAllFiles().catch((error) => {
  console.error("❌ Fatal error:", error.message);
  console.error(error.stack);
  process.exit(1);
});
