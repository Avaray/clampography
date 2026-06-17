import { describe, expect, it } from "bun:test";
import { themes, themesList, light, dark } from "../src/themes.js";

const REQUIRED_VARS = [
  "--clampography-background",
  "--clampography-border",
  "--clampography-error",
  "--clampography-heading",
  "--clampography-info",
  "--clampography-link",
  "--clampography-muted",
  "--clampography-primary",
  "--clampography-secondary",
  "--clampography-success",
  "--clampography-surface",
  "--clampography-text",
  "--clampography-warning",
];

describe("Built-in Themes Definitions", () => {
  it("themes object contains 'light' and 'dark' keys", () => {
    expect(themes).toBeTypeOf("object");
    expect(themes.light).toBeDefined();
    expect(themes.dark).toBeDefined();
  });

  it("themesList array equals Object.keys(themes)", () => {
    expect(themesList).toEqual(Object.keys(themes));
  });

  it("both light and dark themes have all required CSS variables", () => {
    for (const key of REQUIRED_VARS) {
      expect(light[key]).toBeDefined();
      expect(dark[key]).toBeDefined();
    }
  });

  it("light theme has color-scheme: 'light'", () => {
    expect(light["color-scheme"]).toBe("light");
  });

  it("dark theme has color-scheme: 'dark'", () => {
    expect(dark["color-scheme"]).toBe("dark");
  });

  it("both themes have exactly the same set of keys", () => {
    const lightKeys = Object.keys(light).sort();
    const darkKeys = Object.keys(dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it("all CSS variable values in light theme start with 'oklch('", () => {
    for (const [key, value] of Object.entries(light)) {
      if (key.startsWith("--")) {
        expect(value.startsWith("oklch(")).toBe(true);
      }
    }
  });

  it("all CSS variable values in dark theme start with 'oklch('", () => {
    for (const [key, value] of Object.entries(dark)) {
      if (key.startsWith("--")) {
        expect(value.startsWith("oklch(")).toBe(true);
      }
    }
  });

  it("light and dark themes have different values for background and text", () => {
    expect(light["--clampography-background"]).not.toBe(dark["--clampography-background"]);
    expect(light["--clampography-text"]).not.toBe(dark["--clampography-text"]);
  });
});
