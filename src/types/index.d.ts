import type { Config, PluginCreator } from "tailwindcss/types/config";

interface ClampographyOptions {
  themes?: string | string[] | boolean;
  base?: boolean;
  extra?: boolean;
  root?: string;
  prefix?: string | boolean;
  logs?: boolean;
}

declare const clampographyPlugin: PluginCreator<ClampographyOptions>;

export default clampographyPlugin;
