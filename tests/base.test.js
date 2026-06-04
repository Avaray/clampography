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
