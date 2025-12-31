#!/usr/bin/env bun

/**
 * Converts base.css to base.js format with preserved comments
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Configuration
const INPUT_FILE = "base.css";
const OUTPUT_FILE = "base.js";

/**
 * Parse CSS content into structured data
 */
function parseCSS(css) {
  const result = {};
  const lines = css.split("\n");
  let currentContext = result;
  let contextStack = [result];
  let currentSelector = null;
  let inAtLayer = false;
  let buffer = "";
  let commentBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      if (commentBuffer.length > 0) {
        commentBuffer.push("");
      }
      continue;
    }

    // Capture comments
    if (line.startsWith("/*")) {
      const commentLines = [line];
      while (i < lines.length && !lines[i].includes("*/")) {
        i++;
        commentLines.push(lines[i].trim());
      }
      commentBuffer.push(...commentLines);
      continue;
    }

    // Handle @layer
    if (line.startsWith("@layer")) {
      const match = line.match(/@layer\s+(\w+)/);
      if (match) {
        inAtLayer = true;
        currentContext["@layer base"] = {};
        contextStack.push(currentContext["@layer base"]);
        currentContext = currentContext["@layer base"];
      }
      continue;
    }

    // Handle opening brace (new rule)
    if (line.includes("{") && !line.includes("}")) {
      const selector = line.replace("{", "").trim();

      // Store comments before selector
      if (commentBuffer.length > 0) {
        currentContext[`__comment_${Object.keys(currentContext).length}`] =
          commentBuffer.join("\n");
        commentBuffer = [];
      }

      currentContext[selector] = {};
      contextStack.push(currentContext[selector]);
      currentContext = currentContext[selector];
      currentSelector = selector;
      continue;
    }

    // Handle closing brace
    if (line === "}") {
      contextStack.pop();
      currentContext = contextStack[contextStack.length - 1];
      currentSelector = null;
      continue;
    }

    // Handle properties
    if (line.includes(":") && currentSelector) {
      let [prop, ...valueParts] = line.split(":");
      let value = valueParts.join(":").trim();

      // Remove semicolon and inline comments
      const inlineComment = value.match(/\/\*.*?\*\//);
      if (inlineComment) {
        value = value.replace(inlineComment[0], "").trim();
      }
      value = value.replace(";", "").trim();

      prop = prop.trim();

      // Store inline comment separately if exists
      if (inlineComment && inlineComment[0]) {
        currentContext[`__inline_comment_${prop}`] = inlineComment[0];
      }

      currentContext[prop] = value;
    }
  }

  return result;
}

/**
 * Convert parsed CSS to JS object string
 */
function toJSObject(obj, indent = 0) {
  const spaces = "  ".repeat(indent);
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    // Handle comments
    if (key.startsWith("__comment_")) {
      const comment = value.split("\n").map((line) => `${spaces}${line}`).join(
        "\n",
      );
      lines.push(comment);
      continue;
    }

    if (key.startsWith("__inline_comment_")) {
      continue; // Skip inline comments in first pass
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      // It's a nested object (selector)
      lines.push(`${spaces}"${key}": {`);
      lines.push(toJSObject(value, indent + 1));
      lines.push(`${spaces}},`);
    } else {
      // It's a property
      const formattedValue = value.includes('"') || value.includes("'")
        ? `"${value.replace(/"/g, '\\"')}"`
        : `"${value}"`;

      // Check for inline comment
      const inlineCommentKey = `__inline_comment_${key}`;
      const inlineComment = obj[inlineCommentKey];
      const comment = inlineComment ? ` ${inlineComment}` : "";

      lines.push(`${spaces}"${key}": ${formattedValue},${comment}`);
    }
  }

  return lines.join("\n");
}

/**
 * Main conversion function
 */
function convertCSStoJS(cssContent) {
  const parsed = parseCSS(cssContent);
  const jsContent = `export default {\n${
    toJSObject(parsed["@layer base"] || parsed, 1)
  }\n};\n`;
  return jsContent;
}

// Main execution
try {
  console.log(`📖 Reading ${INPUT_FILE}...`);
  const cssContent = readFileSync(resolve(INPUT_FILE), "utf-8");

  console.log("⚙️ Converting CSS to JS...");
  const jsContent = convertCSStoJS(cssContent);

  console.log(`💾 Writing ${OUTPUT_FILE}...`);
  writeFileSync(resolve(OUTPUT_FILE), jsContent, "utf-8");

  console.log("✅ Conversion complete!");
  console.log(`📄 Output: ${OUTPUT_FILE}`);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
