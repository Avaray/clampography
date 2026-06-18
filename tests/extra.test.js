import { describe, expect, it } from "bun:test";
import extraStyles from "../src/extra.js";

function collectDeclarations(obj, result = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") result.push([key, value]);
    else if (value !== null && typeof value === "object") collectDeclarations(value, result);
  }
  return result;
}

describe("Extra Styles Generation", () => {
  it("returns a valid object of extra opinionated styles", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
  });

  it("applies background-color and color CSS vars to body", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles["body"]).toBeDefined();
    expect(styles["body"]["background-color"]).toBe("var(--clampography-background)");
    expect(styles["body"]["color"]).toBe("var(--clampography-text)");
  });

  it("uses --clampography-heading for heading colors", () => {
    const styles = extraStyles({ root: ":root" });
    const headingKey = Object.keys(styles).find(k => k.includes("h1") && k.includes("h6"));
    expect(styles[headingKey]).toBeDefined();
    expect(styles[headingKey]["color"]).toBe("var(--clampography-heading)");
  });

  it("styles links with color, text-decoration, and transition", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles[":root a"]).toBeDefined();
    expect(styles[":root a"]["color"]).toBe("var(--clampography-link)");
    expect(styles[":root a"]["text-decoration-line"]).toBe("underline");
    expect(styles[":root a"]["transition-property"]).toContain("color");
  });

  it("styles ul > li::before with background-color: var(--clampography-primary)", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles[":root ul > li::before"]).toBeDefined();
    expect(styles[":root ul > li::before"]["background-color"]).toBe("var(--clampography-primary)");
  });

  it("styles ol > li::before with color: var(--clampography-primary)", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles[":root ol > li::before"]).toBeDefined();
    expect(styles[":root ol > li::before"]["color"]).toBe("var(--clampography-primary)");
  });

  it("uses border-inline-start-width for blockquote (logical property)", () => {
    const styles = extraStyles({ root: ":root" });
    expect(styles[":root blockquote"]).toBeDefined();
    expect(styles[":root blockquote"]["border-inline-start-width"]).toBe("4px");
  });

  it("does NOT contain physical 'border-left' anywhere in blockquote properties", () => {
    const styles = extraStyles({ root: ":root" });
    const blockquoteStyles = styles[":root blockquote"];
    for (const key of Object.keys(blockquoteStyles)) {
      expect(key).not.toContain("border-left");
    }
  });

  it("includes @media (prefers-reduced-motion: reduce) block with transition: none", () => {
    const styles = extraStyles({ root: ":root" });
    const reduceMotion = styles["@media (prefers-reduced-motion: reduce)"];
    expect(reduceMotion).toBeDefined();
    expect(reduceMotion["body"]).toBeDefined();
    expect(reduceMotion["body"]["transition"]).toBe("none");
  });

  it("includes @media (prefers-contrast: more) block with background-color: white on body", () => {
    const styles = extraStyles({ root: ":root" });
    const contrastMore = styles["@media (prefers-contrast: more)"];
    expect(contrastMore).toBeDefined();
    expect(contrastMore["body"]).toBeDefined();
    expect(contrastMore["body"]["background-color"]).toBe("white");
  });

  it("uses border-inline-start-color: black for blockquote in high-contrast mode", () => {
    const styles = extraStyles({ root: ":root" });
    const contrastMore = styles["@media (prefers-contrast: more)"];
    expect(contrastMore[":root blockquote"]).toBeDefined();
    expect(contrastMore[":root blockquote"]["border-inline-start-color"]).toBe("black");
  });

  it("respects custom root scoping", () => {
    const styles = extraStyles({ root: "#app" });
    expect(styles["#app"]).toBeDefined(); // body replacement
    expect(styles["#app blockquote"]).toBeDefined();
    expect(styles[":root blockquote"]).toBeUndefined();
  });

  it("applies typography isolation properly", () => {
    const styles = extraStyles({ root: ":root", typography: ".prose" });
    expect(styles["body .prose"]).toBeDefined(); // body replacement with typography
    expect(styles[":root .prose blockquote"]).toBeDefined();
    expect(styles[":root blockquote"]).toBeUndefined();
  });

  describe("RTL / Logical Properties", () => {
    const FORBIDDEN_PROPS = [
      "padding-left",
      "padding-right",
      "margin-left",
      "margin-right",
      "border-left",
      "border-right",
      "border-left-width",
      "border-right-width",
      "border-left-color",
      "border-right-color",
      "border-left-style",
      "border-right-style",
    ];

    it("does not use any physical left/right properties", () => {
      const declarations = collectDeclarations(extraStyles({}));
      for (const [prop] of declarations) {
        expect(FORBIDDEN_PROPS, `Found forbidden property: ${prop}`).not.toContain(prop);
      }
    });

    it("does not use text-align: left or text-align: right", () => {
      const declarations = collectDeclarations(extraStyles({}));
      for (const [key, value] of declarations) {
        if (key === "text-align") {
          expect(["left", "right"]).not.toContain(value);
        }
      }
    });
  });
});
