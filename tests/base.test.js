import { describe, expect, it } from "bun:test";
import baseStyles from "../src/base.js";

/** Recursively collects all [prop, value] string declarations */
function collectDeclarations(obj, result = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") result.push([key, value]);
    else if (value !== null && typeof value === "object") collectDeclarations(value, result);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("Base Styles Generation", () => {
  it("returns a valid object of base styles", () => {
    const styles = baseStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
    expect(styles[":where(:root)"]).toBeDefined();
    expect(styles[":where(:root)"]["--spacing-md"]).toBeDefined();
    expect(styles[":where(:root)"]["--font-family-base"]).toBeDefined();
    expect(styles[":root h1"]).toBeDefined();
    expect(styles[":root h1"]["font-weight"]).toBe("800");
  });

  it("respects custom root scoping", () => {
    const styles = baseStyles({ root: "#my-app" });
    expect(styles[":where(#my-app)"]).toBeDefined();
    expect(styles["#my-app h1"]).toBeDefined();
    expect(styles[":root"]).toBeUndefined();
  });

  it("generates dynamic fluid sizes based on fluidMin and fluidMax", () => {
    const defaultStyles = baseStyles({});
    const customStyles = baseStyles({ fluidMin: 500, fluidMax: 1500 });
    expect(defaultStyles[":where(:root)"]["--spacing-md"]).not.toBe(
      customStyles[":where(:root)"]["--spacing-md"]
    );
    expect(customStyles[":where(:root)"]["--spacing-md"]).toContain("clamp(");
  });

  it("isolates typography scope when typography option is provided", () => {
    const styles = baseStyles({ typography: ".prose" });
    expect(styles[":where(:root)"]).toBeDefined();
    expect(styles[":root .prose h1"]).toBeDefined();
    expect(styles[":root h1"]).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("scaleMode option", () => {
  const ALL_HEADING_SIZES = [
    "--clampography-h1-size",
    "--clampography-h2-size",
    "--clampography-h3-size",
    "--clampography-h4-size",
    "--clampography-h5-size",
    "--clampography-h6-size",
  ];

  const FLUID_SPACING = [
    "--spacing-xs",
    "--spacing-sm",
    "--spacing-md",
    "--spacing-lg",
    "--spacing-xl",
    "--list-indent",
  ];

  it("defaults to 'viewport' mode (vw) when scaleMode is not set", () => {
    const root = baseStyles({})[":where(:root)"];
    for (const key of FLUID_SPACING) {
      if (root[key].startsWith("clamp(")) expect(root[key]).toContain("vw");
    }
    for (const key of ALL_HEADING_SIZES) {
      if (root[key].startsWith("clamp(")) {
        expect(root[key]).toContain("100vw");
        expect(root[key]).not.toContain("cqi");
      }
    }
  });

  it("uses vw when scaleMode is explicitly 'viewport'", () => {
    const root = baseStyles({ scaleMode: "viewport" })[":where(:root)"];
    for (const key of ALL_HEADING_SIZES) {
      if (root[key].startsWith("clamp(")) expect(root[key]).toContain("100vw");
    }
    if (root["--spacing-md"].startsWith("clamp(")) {
      expect(root["--spacing-md"]).toContain("vw");
    }
  });

  it("uses cqi for all spacing when scaleMode is 'container'", () => {
    const root = baseStyles({ scaleMode: "container" })[":where(:root)"];
    for (const key of FLUID_SPACING) {
      if (root[key].startsWith("clamp(")) {
        expect(root[key]).toContain("cqi");
        expect(root[key]).not.toContain("vw");
      }
    }
  });

  it("uses cqi for all heading sizes when scaleMode is 'container'", () => {
    const root = baseStyles({ scaleMode: "container" })[":where(:root)"];
    for (const key of ALL_HEADING_SIZES) {
      if (root[key].startsWith("clamp(")) {
        expect(root[key]).toContain("100cqi");
        expect(root[key]).not.toContain("100vw");
      }
    }
  });

  it("accepts kebab-case alias 'scale-mode'", () => {
    const root = baseStyles({ "scale-mode": "container" })[":where(:root)"];
    if (root["--spacing-md"].startsWith("clamp(")) {
      expect(root["--spacing-md"]).toContain("cqi");
    }
    if (root["--clampography-h1-size"].startsWith("clamp(")) {
      expect(root["--clampography-h1-size"]).toContain("100cqi");
    }
  });

  it("falls back to vw for unknown scaleMode values", () => {
    const root = baseStyles({ scaleMode: "unknown-value" })[":where(:root)"];
    if (root["--spacing-md"].startsWith("clamp(")) {
      expect(root["--spacing-md"]).toContain("vw");
    }
    if (root["--clampography-h1-size"].startsWith("clamp(")) {
      expect(root["--clampography-h1-size"]).toContain("100vw");
    }
  });

  it("produces mathematically identical clamp bounds in both modes (only unit differs)", () => {
    const vw = baseStyles({ scaleMode: "viewport" })[":where(:root)"];
    const cqi = baseStyles({ scaleMode: "container" })[":where(:root)"];
    const strip = (s) => s.replace(/vw|cqi/g, "UNIT");
    expect(strip(cqi["--spacing-md"])).toBe(strip(vw["--spacing-md"]));
    expect(strip(cqi["--clampography-h1-size"])).toBe(strip(vw["--clampography-h1-size"]));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Fluid math engine edge cases", () => {
  it("h5 returns a clamp() expression based on CSS variables even when min and max are equal", () => {
    // Unlike spacing which uses makeFluid, headings use inline CSS calc()
    const root = baseStyles({})[":where(:root)"];
    expect(root["--clampography-h5-size"]).toContain("clamp(");
    expect(root["--clampography-h5-min"]).toBe("1");
    expect(root["--clampography-h5-max"]).toBe("1");
  });

  it("h6 returns a clamp() expression based on CSS variables even when min and max are equal", () => {
    const root = baseStyles({})[":where(:root)"];
    expect(root["--clampography-h6-size"]).toContain("clamp(");
    expect(root["--clampography-h6-min"]).toBe("0.875");
    expect(root["--clampography-h6-max"]).toBe("0.875");
  });

  it("returns static spacing values when fluidMin equals fluidMax (invalid range)", () => {
    const root = baseStyles({ fluidMin: 800, fluidMax: 800 })[":where(:root)"];
    expect(root["--spacing-md"]).not.toContain("clamp(");
    expect(root["--spacing-xs"]).not.toContain("clamp(");
  });

  it("exposes --clampography-v-min and --clampography-v-max as unitless rem values", () => {
    // 320px / 16 = 20rem, 1280px / 16 = 80rem
    const root = baseStyles({ fluidMin: 320, fluidMax: 1280 })[":where(:root)"];
    expect(root["--clampography-v-min"]).toBe("20");
    expect(root["--clampography-v-max"]).toBe("80");
  });

  it("updates v-min and v-max when custom fluid bounds are provided", () => {
    // 480px / 16 = 30rem, 1440px / 16 = 90rem
    const root = baseStyles({ fluidMin: 480, fluidMax: 1440 })[":where(:root)"];
    expect(root["--clampography-v-min"]).toBe("30");
    expect(root["--clampography-v-max"]).toBe("90");
  });

  it("h1 max is larger than h2 max (heading hierarchy is preserved)", () => {
    const root = baseStyles({})[":where(:root)"];
    expect(parseFloat(root["--clampography-h1-max"])).toBeGreaterThan(
      parseFloat(root["--clampography-h2-max"])
    );
    expect(parseFloat(root["--clampography-h2-max"])).toBeGreaterThan(
      parseFloat(root["--clampography-h3-max"])
    );
    expect(parseFloat(root["--clampography-h3-max"])).toBeGreaterThan(
      parseFloat(root["--clampography-h4-max"])
    );
  });

  it("fluid-min 'px' suffix is handled correctly by parseInt", () => {
    // The plugin uses parseInt() so '375px' and 375 should produce the same result
    const withPx = baseStyles({ fluidMin: parseInt("375px"), fluidMax: 1280 })[":where(:root)"];
    const withNum = baseStyles({ fluidMin: 375, fluidMax: 1280 })[":where(:root)"];
    expect(withPx["--spacing-md"]).toBe(withNum["--spacing-md"]);
    expect(withPx["--clampography-v-min"]).toBe(withNum["--clampography-v-min"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("RTL / Logical Properties (base.js)", () => {
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

  it("does not use any physical left/right padding or margin properties", () => {
    const declarations = collectDeclarations(baseStyles({}));
    for (const [prop] of declarations) {
      expect(FORBIDDEN_PROPS, `Found forbidden property: ${prop}`).not.toContain(prop);
    }
  });

  it("does not use text-align: left or text-align: right", () => {
    const declarations = collectDeclarations(baseStyles({}));
    for (const [key, value] of declarations) {
      if (key === "text-align") {
        expect(["left", "right"]).not.toContain(value);
      }
    }
  });

  it("uses padding-inline-start for list and menu indentation", () => {
    const declarations = collectDeclarations(baseStyles({}));
    expect(declarations.some(([k]) => k === "padding-inline-start")).toBe(true);
  });

  it("uses inset-inline-end for list bullet and number positioning", () => {
    const declarations = collectDeclarations(baseStyles({}));
    expect(declarations.some(([k]) => k === "inset-inline-end")).toBe(true);
  });

  it("uses margin-inline-start for definition list (dd) indentation", () => {
    const declarations = collectDeclarations(baseStyles({}));
    expect(declarations.some(([k]) => k === "margin-inline-start")).toBe(true);
  });
});
