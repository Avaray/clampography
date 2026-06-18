import type { Config, PluginCreator } from "tailwindcss/plugin";

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
  typography?: string;
  root?: string;
  prefix?: string | boolean;
  logs?: boolean;
}

declare const clampographyPlugin: PluginCreator<ClampographyOptions>;

export default clampographyPlugin;

export type { ClampographyVars } from "./vars.js";
