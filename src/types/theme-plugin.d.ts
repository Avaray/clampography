import type { PluginCreator } from "tailwindcss/types/config";

interface ThemePluginOptions {
  name: string;
  default?: boolean;
  prefersdark?: boolean;
  "color-scheme"?: "light" | "dark";
  root?: string;
  logs?: boolean;

  // Color options
  background?: string;
  border?: string;
  error?: string;
  heading?: string;
  info?: string;
  link?: string;
  muted?: string;
  primary?: string;
  secondary?: string;
  success?: string;
  surface?: string;
  text?: string;
  warning?: string;

  // Allow custom CSS variables
  [key: `--${string}`]: string | undefined;
}

declare const themePlugin: PluginCreator<ThemePluginOptions>;

export default themePlugin;
