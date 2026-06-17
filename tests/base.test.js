import { describe, expect, it } from "bun:test";
import baseStyles from "../src/base.js";
import extraStyles from "../src/extra.js";

describe("Base Styles Generation", () => {
  it("should return a valid object of base styles", () => {
    const styles = baseStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
    expect(styles[":where(:root)"]).toBeDefined();

    // Check if typography fluid scales exist
    expect(styles[":where(:root)"]["--spacing-md"]).toBeDefined();
    expect(styles[":where(:root)"]["--font-family-base"]).toBeDefined();

    // Check scoped tags
    expect(styles[":root h1"]).toBeDefined();
    expect(styles[":root h1"]["font-weight"]).toBe("800");
  });

  it("should respect custom root scoping", () => {
    const styles = baseStyles({ root: "#my-app" });
    expect(styles[":where(#my-app)"]).toBeDefined();
    expect(styles["#my-app h1"]).toBeDefined();

    // Ensure :root wasn't leaked
    expect(styles[":root"]).toBeUndefined();
  });

  it("should generate dynamic fluid sizes based on fluidMin and fluidMax", () => {
    // Generate styles with default limits (320-1280)
    const defaultStyles = baseStyles({});
    const defaultSpacingMd = defaultStyles[":where(:root)"]["--spacing-md"];

    // Generate styles with custom limits
    const customStyles = baseStyles({ fluidMin: 500, fluidMax: 1500 });
    const customSpacingMd = customStyles[":where(:root)"]["--spacing-md"];

    // The output clamp strings should be mathematically different
    expect(defaultSpacingMd).not.toBe(customSpacingMd);
    expect(customSpacingMd).toContain("clamp(");
  });

  it("should isolate typography scope when typography option is provided", () => {
    // With typography isolation
    const isolatedStyles = baseStyles({ typography: ".prose" });

    // Base variables should still be on :where(:root)
    expect(isolatedStyles[":where(:root)"]).toBeDefined();

    // Tag selectors should be prefixed with the typography class
    expect(isolatedStyles[":root .prose h1"]).toBeDefined();

    // Ensure global tag selectors do NOT exist
    expect(isolatedStyles[":root h1"]).toBeUndefined();
  });
});

describe("scaleMode option", () => {
  const ALL_HEADING_SIZES = [
    "--clampography-h1-size",
    "--clampography-h2-size",
    "--clampography-h3-size",
    "--clampography-h4-size",
    "--clampography-h5-size",
    "--clampography-h6-size",
  ];

  const ALL_SPACING = [
    "--spacing-xs",
    "--spacing-sm",
    "--spacing-md",
    "--spacing-lg",
    "--spacing-xl",
    "--list-indent",
  ];

  it("defaults to 'viewport' mode (vw) when scaleMode is not set", () => {
    const root = baseStyles({})[":where(:root)"];
    for (const key of ALL_SPACING) {
      expect(root[key]).toContain("vw");
    }
    for (const key of ALL_HEADING_SIZES) {
      expect(root[key]).toContain("100vw");
      expect(root[key]).not.toContain("cqi");
    }
  });

  it("uses vw when scaleMode is explicitly 'viewport'", () => {
    const root = baseStyles({ scaleMode: "viewport" })[":where(:root)"];
    for (const key of ALL_HEADING_SIZES) {
      expect(root[key]).toContain("100vw");
    }
    expect(root["--spacing-md"]).toContain("vw");
  });

  it("uses cqi for all spacing when scaleMode is 'container'", () => {
    const root = baseStyles({ scaleMode: "container" })[":where(:root)"];
    for (const key of ALL_SPACING) {
      // static values (min===max) won't have a unit — filter them out
      if (root[key].startsWith("clamp(")) {
        expect(root[key]).toContain("cqi");
        expect(root[key]).not.toContain("vw");
      }
    }
  });

  it("uses cqi for all heading sizes when scaleMode is 'container'", () => {
    const root = baseStyles({ scaleMode: "container" })[":where(:root)"];
    for (const key of ALL_HEADING_SIZES) {
      // static headings (h5, h6 have min===max) won't have a unit
      if (root[key].startsWith("clamp(")) {
        expect(root[key]).toContain("100cqi");
        expect(root[key]).not.toContain("100vw");
      }
    }
  });

  it("accepts kebab-case alias 'scale-mode'", () => {
    const root = baseStyles({ "scale-mode": "container" })[":where(:root)"];
    expect(root["--spacing-md"]).toContain("cqi");
    expect(root["--clampography-h1-size"]).toContain("100cqi");
  });

  it("falls back to vw for any unknown scaleMode value", () => {
    const root = baseStyles({ scaleMode: "something-random" })[":where(:root)"];
    expect(root["--spacing-md"]).toContain("vw");
    expect(root["--clampography-h1-size"]).toContain("100vw");
  });

  it("scaleMode 'container' produces mathematically identical clamp bounds as 'viewport'", () => {
    const rootVw = baseStyles({ scaleMode: "viewport" })[":where(:root)"];
    const rootCqi = baseStyles({ scaleMode: "container" })[":where(:root)"];

    // The numeric bounds in clamp() should be identical — only the unit differs
    const stripUnit = (str) => str.replace(/vw|cqi/g, "UNIT");
    expect(stripUnit(rootCqi["--spacing-md"])).toBe(stripUnit(rootVw["--spacing-md"]));
    expect(stripUnit(rootCqi["--clampography-h1-size"])).toBe(stripUnit(rootVw["--clampography-h1-size"]));
  });
});

describe("Extra Styles Generation", () => {
  it("should return a valid object of extra opinionated styles", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");

    // Ensure colored links exist
    expect(styles[":root a"]).toBeDefined();
    expect(styles[":root a"]["text-decoration-line"]).toBe("underline");
  });

  it("should respect custom root scoping", () => {
    const styles = extraStyles({ root: ".prose-container" });
    expect(styles[".prose-container blockquote"]).toBeDefined();
  });
});
