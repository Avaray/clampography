import plugin from "tailwindcss/plugin";

interface ClampographyOptions {
  themes?: string | string[] | boolean;
  base?: boolean;
  extra?: boolean;
  forms?: boolean;
  kbd?: boolean;
  print?: boolean;
  "fluid-min"?: string | number;
  fluidMin?: string | number;
  "fluid-max"?: string | number;
  fluidMax?: string | number;
  scrollbar?: boolean;
  highlights?: boolean;
  "scale-mode"?: "viewport" | "container" | string;
  scaleMode?: "viewport" | "container" | string;
  typography?: string;
  root?: string;
  prefix?: string | boolean;
  logs?: boolean;
}

declare const clampographyPlugin: ReturnType<typeof plugin.withOptions<ClampographyOptions>>;

export default clampographyPlugin;

export type { ClampographyVars } from "./vars.js";
