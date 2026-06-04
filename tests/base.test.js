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
