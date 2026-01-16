export interface ThemeColors {
  "color-scheme": "light" | "dark";
  "--clampography-background": string;
  "--clampography-border": string;
  "--clampography-error": string;
  "--clampography-heading": string;
  "--clampography-info": string;
  "--clampography-link": string;
  "--clampography-muted": string;
  "--clampography-primary": string;
  "--clampography-secondary": string;
  "--clampography-success": string;
  "--clampography-surface": string;
  "--clampography-text": string;
  "--clampography-warning": string;
  // Allow index signature
  [key: string]: string;
}
