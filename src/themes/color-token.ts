export const COLOR_TOKENS = [
  "primary",
  "secondary",
  "success",
  "warning",
  "destructive",
  "info",
  "neutral",
  "white",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];
