import { describe, expect, it } from "bun:test";
import clampographyPlugin from "../src/index.js";
import { themes } from "../src/themes.js";

// Helper functions for testing the plugin handler
function runHandler(options) {
  const captured = [];
  const instance = clampographyPlugin({ logs: false, ...options });
  instance.handler({ addBase: (s) => captured.push(s) });
  return captured;
}

function hasKey(captured, predicate) {
  return captured.some(styles => Object.keys(styles).some(predicate));
}

describe("Tailwind Plugin - General configuration", () => {
  it("should return a plugin handler and config object via withOptions", () => {
    const pluginInstance = clampographyPlugin({ themes: "light, dark", prefix: "test", logs: false });
    
    expect(pluginInstance).toBeTypeOf("object");
    expect(pluginInstance.handler).toBeTypeOf("function");
    expect(pluginInstance.config).toBeTypeOf("object");
  });

  it("should extend theme colors correctly based on prefix", () => {
    const pluginInstance = clampographyPlugin({ prefix: "custom", logs: false });
    
    const config = pluginInstance.config;
    expect(config.theme.extend.colors).toBeDefined();
    
    expect(config.theme.extend.colors["custom-primary"]).toBe("var(--clampography-primary)");
    expect(config.theme.extend.colors["custom-background"]).toBe("var(--clampography-background)");
  });

  it("should default to clampography prefix if true is passed", () => {
    const pluginInstance = clampographyPlugin({ prefix: true, logs: false });
    const config = pluginInstance.config;
    
    expect(config.theme.extend.colors["clampography-primary"]).toBe("var(--clampography-primary)");
  });

  it("should not use prefix if prefix option is explicitly false", () => {
    const pluginInstance = clampographyPlugin({ prefix: false, logs: false });
    const config = pluginInstance.config;
    
    expect(config.theme.extend.colors["primary"]).toBe("var(--clampography-primary)");
  });
});

describe("Plugin Handler - Style Modules", () => {
  it("generates base styles by default (base: true)", () => {
    const captured = runHandler({});
    expect(hasKey(captured, k => k === ":where(:root)")).toBe(true);
  });

  it("does not generate base styles if base is 'false'", () => {
    const captured = runHandler({ base: "false" });
    expect(hasKey(captured, k => k === ":where(:root)")).toBe(false);
  });

  it("generates base styles if base is 'yes'", () => {
    const captured = runHandler({ base: "yes" });
    expect(hasKey(captured, k => k === ":where(:root)")).toBe(true);
  });

  it("does not generate base styles if base is 'no'", () => {
    const captured = runHandler({ base: "no" });
    expect(hasKey(captured, k => k === ":where(:root)")).toBe(false);
  });

  it("generates extra styles if extra is 'true'", () => {
    const captured = runHandler({ extra: "true" });
    expect(hasKey(captured, k => k === "body")).toBe(true);
    // check if it has the actual property
    const hasBg = captured.some(styles => styles["body"] && styles["body"]["background-color"]);
    expect(hasBg).toBe(true);
  });

  it("does not generate extra styles by default", () => {
    const captured = runHandler({});
    const hasBg = captured.some(styles => styles["body"] && styles["body"]["background-color"]);
    expect(hasBg).toBe(false);
  });
});

describe("Plugin Handler - Theme Generation", () => {
  it("does not generate any themes if themes is false", () => {
    const captured = runHandler({ themes: false });
    expect(hasKey(captured, k => k.includes("data-theme"))).toBe(false);
  });

  it("generates specific theme if requested", () => {
    const captured = runHandler({ themes: "light" });
    expect(hasKey(captured, k => k.includes('data-theme="light"'))).toBe(true);
  });

  it("generates all built-in themes if themes is 'all'", () => {
    const captured = runHandler({ themes: "all" });
    for (const t of Object.keys(themes)) {
      expect(hasKey(captured, k => k.includes(`data-theme="${t}"`))).toBe(true);
    }
  });

  it("ignores nonexistent themes completely", () => {
    const captured = runHandler({ themes: "nonexistent", base: false });
    expect(hasKey(captured, k => k.includes("data-theme"))).toBe(false);
    expect(captured.length).toBe(0);
  });

  it("adds default fallback selector (:where(:root)) if --default flag is present", () => {
    const captured = runHandler({ themes: "light --default", base: false });
    expect(hasKey(captured, k => k.includes(":where(:root)"))).toBe(true);
  });

  it("adds prefers-color-scheme media query if --prefersdark flag is present", () => {
    const captured = runHandler({ themes: "dark --prefersdark", base: false });
    expect(hasKey(captured, k => k === "@media (prefers-color-scheme: dark)")).toBe(true);
  });

  it("respects custom root selector for themes", () => {
    const captured = runHandler({ root: "#app", themes: "light", base: false });
    expect(hasKey(captured, k => k.includes('#app[data-theme='))).toBe(true);
    expect(hasKey(captured, k => k.includes('html[data-theme='))).toBe(false);
  });

  it("generates multiple specified themes", () => {
    const captured = runHandler({ themes: "light, dark", base: false });
    expect(hasKey(captured, k => k.includes('data-theme="light"'))).toBe(true);
    expect(hasKey(captured, k => k.includes('data-theme="dark"'))).toBe(true);
  });
});

describe("Built-in Themes Data", () => {
  it("should contain standard built-in themes", () => {
    expect(themes).toBeTypeOf("object");
    expect(themes.light).toBeDefined();
    expect(themes.dark).toBeDefined();
  });

  it("should define basic color properties in themes", () => {
    expect(themes.light["--clampography-background"]).toBeDefined();
    expect(themes.light["--clampography-primary"]).toBeDefined();
  });
});
