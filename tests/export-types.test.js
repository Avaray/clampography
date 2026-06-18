import { test, expect } from "bun:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("export-types.js generates a valid TypeScript definition file", async () => {
  const scriptPath = path.resolve(__dirname, "../src/export-types.js");
  const outputPath = path.resolve(__dirname, "../src/types/vars.d.ts");

  // Remove existing file to ensure we're testing the generation
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  // Run the script
  const proc = Bun.spawn(["bun", scriptPath]);
  await proc.exited;

  expect(proc.exitCode).toBe(0);

  // Check if file exists
  expect(fs.existsSync(outputPath)).toBe(true);

  // Read file contents
  const content = fs.readFileSync(outputPath, "utf-8");

  // Check for expected signature
  expect(content).toContain("export type ClampographyVars =");

  // Check for critical variable names
  expect(content).toContain('"--clampography-primary"');
  expect(content).toContain('"--clampography-background"');
  expect(content).toContain('"--clampography-spacing-md"');
  expect(content).toContain('"--clampography-h1-size"');
  expect(content).toContain('"--clampography-font-base"');
});
