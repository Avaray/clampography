import { describe, expect, it } from "bun:test";
import kbdStyles from "../src/kbd.js";

describe("Kbd Styles Generation", () => {
  it("returns a valid object with at least 2 keys", () => {
    const styles = kbdStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
    expect(Object.keys(styles).length).toBeGreaterThanOrEqual(2);
  });

  it("styles kbd with display: inline-block, font-weight: 700, and user-select: none", () => {
    const styles = kbdStyles({ root: ":root" });
    const kbdKey = ":root kbd";
    expect(styles[kbdKey]).toBeDefined();
    expect(styles[kbdKey]["display"]).toBe("inline-block");
    expect(styles[kbdKey]["font-weight"]).toBe("700");
    expect(styles[kbdKey]["user-select"]).toBe("none");
  });

  it("uses --clampography-surface for background-color", () => {
    const styles = kbdStyles({ root: ":root" });
    expect(styles[":root kbd"]["background-color"]).toContain("--clampography-surface");
  });

  it("uses --clampography-border for border", () => {
    const styles = kbdStyles({ root: ":root" });
    expect(styles[":root kbd"]["border"]).toContain("--clampography-border");
  });

  it("has a box-shadow value containing 'inset' and 'rgba'", () => {
    const styles = kbdStyles({ root: ":root" });
    const shadow = styles[":root kbd"]["box-shadow"];
    expect(shadow).toContain("inset");
    expect(shadow).toContain("rgba");
  });

  it("has a box-shadow value containing 'color-mix'", () => {
    const styles = kbdStyles({ root: ":root" });
    const shadow = styles[":root kbd"]["box-shadow"];
    expect(shadow).toContain("color-mix");
  });

  it("styles kbd:active with transform containing translateY(2px)", () => {
    const styles = kbdStyles({ root: ":root" });
    const activeKey = ":root kbd:active";
    expect(styles[activeKey]).toBeDefined();
    expect(styles[activeKey]["transform"]).toContain("translateY(2px)");
  });

  it("starts kbd:active box-shadow with '0 0 0'", () => {
    const styles = kbdStyles({ root: ":root" });
    const shadow = styles[":root kbd:active"]["box-shadow"];
    expect(shadow.startsWith("0 0 0 ")).toBe(true);
  });

  it("respects custom root scoping", () => {
    const styles = kbdStyles({ root: "#app" });
    expect(styles["#app kbd"]).toBeDefined();
    expect(styles[":root kbd"]).toBeUndefined();
  });
});
