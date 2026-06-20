import { describe, expect, it } from "bun:test";
import formsStyles from "../src/forms.js";

function collectDeclarations(obj, result = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") result.push([key, value]);
    else if (value !== null && typeof value === "object") collectDeclarations(value, result);
  }
  return result;
}

describe("Forms Styles Generation", () => {
  it("returns a valid object of forms styles", () => {
    const styles = formsStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
  });

  it("styles buttons with display: inline-flex and font-weight: 500", () => {
    const styles = formsStyles({ root: ":root" });
    const buttonKey = Object.keys(styles).find(k => k.includes("button") && !k.includes("hover") && !k.includes("primary") && !k.includes("cancel"));
    expect(buttonKey).toBeDefined();
    expect(styles[buttonKey]["display"]).toBe("inline-flex");
    expect(styles[buttonKey]["font-weight"]).toBe("500");
  });

  it("styles buttons with --clampography-surface background", () => {
    const styles = formsStyles({ root: ":root" });
    const buttonKey = Object.keys(styles).find(k => k.includes("button") && !k.includes("hover") && !k.includes("primary") && !k.includes("cancel"));
    expect(styles[buttonKey]["background-color"]).toBe("var(--clampography-surface)");
  });

  it("styles text inputs with display: block and width: 100%", () => {
    const styles = formsStyles({ root: ":root" });
    const inputKey = Object.keys(styles).find(k => k.includes("textarea, select") && !k.includes("focus") && !k.includes("disabled") && !k.includes("readonly"));
    expect(inputKey).toBeDefined();
    expect(styles[inputKey]["display"]).toBe("block");
    expect(styles[inputKey]["width"]).toBe("100%");
  });

  it("styles disabled state with opacity: 0.5 and cursor: not-allowed", () => {
    const styles = formsStyles({ root: ":root" });
    const disabledKey = Object.keys(styles).find(k => k.includes(":disabled"));
    expect(disabledKey).toBeDefined();
    expect(styles[disabledKey]["opacity"]).toBe("0.5");
    expect(styles[disabledKey]["cursor"]).toBe("not-allowed");
  });

  it("styles user-invalid state with border-color: var(--clampography-error)", () => {
    const styles = formsStyles({ root: ":root" });
    const invalidKey = Object.keys(styles).find(k => k.includes(":user-invalid") && !k.includes("focus"));
    expect(invalidKey).toBeDefined();
    expect(styles[invalidKey]["border-color"]).toBe("var(--clampography-error)");
  });

  it("styles readonly state with cursor: default", () => {
    const styles = formsStyles({ root: ":root" });
    const readonlyKey = Object.keys(styles).find(k => k.includes("[readonly]"));
    expect(readonlyKey).toBeDefined();
    expect(styles[readonlyKey]["cursor"]).toBe("default");
  });

  it("styles select with padding-inline-end and background-image", () => {
    const styles = formsStyles({ root: ":root" });
    const selectKey = Object.keys(styles).find(
      k => k.includes("select:not(") && k.includes("[multiple]")
    );
    expect(selectKey).toBeDefined();
    expect(styles[selectKey]["padding-inline-end"]).toBe("2.5rem");
    expect(styles[selectKey]["padding-right"]).toBeUndefined();
    expect(styles[selectKey]["background-image"]).toContain("linear-gradient");
  });

  it("styles file-selector-button with margin-inline-end", () => {
    const styles = formsStyles({ root: ":root" });
    const fileKey = Object.keys(styles).find(k => k.includes("::file-selector-button") && !k.includes("hover"));
    expect(fileKey).toBeDefined();
    expect(styles[fileKey]["margin-inline-end"]).toBeDefined();
    expect(styles[fileKey]["margin-right"]).toBeUndefined();
  });

  it("styles checkbox and radio with accent-color: var(--clampography-primary)", () => {
    const styles = formsStyles({ root: ":root" });
    const checkKey = Object.keys(styles).find(k => k.includes("[type='checkbox'], :root [type='radio']") || k === ":root [type='checkbox'], :root [type='radio']");
    expect(checkKey).toBeDefined();
    expect(styles[checkKey]["accent-color"]).toBe("var(--clampography-primary)");
  });

  it("styles range with width: 100%", () => {
    const styles = formsStyles({ root: ":root" });
    const rangeKey = Object.keys(styles).find(k => k.includes("[type='range']"));
    expect(rangeKey).toBeDefined();
    expect(styles[rangeKey]["width"]).toBe("100%");
  });

  it("styles color picker with border-radius", () => {
    const styles = formsStyles({ root: ":root" });
    const colorKey = Object.keys(styles).find(k => k.includes("[type='color']"));
    expect(colorKey).toBeDefined();
    expect(styles[colorKey]["border-radius"]).toBeDefined();
  });

  it("styles progress with width: 100%", () => {
    const styles = formsStyles({ root: ":root" });
    const progressKey = ":root progress";
    expect(styles[progressKey]).toBeDefined();
    expect(styles[progressKey]["width"]).toBe("100%");
  });

  it("styles meter with width: 100%", () => {
    const styles = formsStyles({ root: ":root" });
    const meterKey = ":root meter";
    expect(styles[meterKey]).toBeDefined();
    expect(styles[meterKey]["width"]).toBe("100%");
  });

  it("includes @supports (-moz-appearance: none) block", () => {
    const styles = formsStyles({ root: ":root" });
    const supportsKey = "@supports (-moz-appearance: none)";
    expect(styles[supportsKey]).toBeDefined();
  });

  it("respects custom root scoping", () => {
    const styles = formsStyles({ root: "#myapp" });
    const buttonKey = Object.keys(styles).find(k => k.includes("button") && !k.includes("hover") && !k.includes("primary") && !k.includes("cancel"));
    expect(buttonKey).toContain("#myapp");
    expect(buttonKey).not.toContain(":root");
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
      const declarations = collectDeclarations(formsStyles({}));
      for (const [prop] of declarations) {
        expect(FORBIDDEN_PROPS, `Found forbidden property: ${prop}`).not.toContain(prop);
      }
    });
  });
});
