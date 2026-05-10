import { describe, expect, it, mock } from "bun:test";
import clampographyPlugin from "../src/index.js";
import { themes } from "../src/themes.js";

describe("Tailwind Plugin", () => {
  it("should return a plugin handler and config object via withOptions", () => {
    // Calling the plugin with options should return an object with handler and config
    const pluginInstance = clampographyPlugin({ themes: "light, dark", prefix: "test" });
    
    expect(pluginInstance).toBeTypeOf("object");
    expect(pluginInstance.handler).toBeTypeOf("function");
    expect(pluginInstance.config).toBeTypeOf("object");
  });

  it("should extend theme colors correctly based on prefix", () => {
    const pluginInstance = clampographyPlugin({ prefix: "custom" });
    
    // config is the extended Tailwind theme configuration object
    const config = pluginInstance.config;
    expect(config.theme.extend.colors).toBeDefined();
    
    // Check if prefix was applied to the Tailwind utilities
    expect(config.theme.extend.colors["custom-primary"]).toBe("var(--clampography-primary)");
    expect(config.theme.extend.colors["custom-background"]).toBe("var(--clampography-background)");
  });

  it("should default to clampography prefix if true is passed", () => {
    const pluginInstance = clampographyPlugin({ prefix: true });
    const config = pluginInstance.config;
    
    expect(config.theme.extend.colors["clampography-primary"]).toBe("var(--clampography-primary)");
  });

  it("should not use prefix if prefix option is explicitly false", () => {
    const pluginInstance = clampographyPlugin({ prefix: false });
    const config = pluginInstance.config;
    
    // Without prefix, the class is just 'primary'
    expect(config.theme.extend.colors["primary"]).toBe("var(--clampography-primary)");
  });
});

describe("Built-in Themes Data", () => {
  it("should contain standard built-in themes", () => {
    expect(themes).toBeTypeOf("object");
    expect(themes.light).toBeDefined();
    expect(themes.dark).toBeDefined();
    expect(themes.retro).toBeDefined();
  });

  it("should define basic color properties in themes", () => {
    expect(themes.light["--clampography-background"]).toBeDefined();
    expect(themes.light["--clampography-primary"]).toBeDefined();
  });
});
