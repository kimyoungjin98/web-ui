import { ParagraphProps } from "./paragraph.types";

export const ParagraphTextAlign: Record<
  NonNullable<ParagraphProps["textAlign"]>,
  React.CSSProperties
> = {
  inherit: { textAlign: "inherit" },
  initial: { textAlign: "initial" },
  revert: { textAlign: "revert" },
  "revert-layer": { textAlign: "revert-layer" },
  unset: { textAlign: "unset" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
  justify: { textAlign: "justify" },
  left: { textAlign: "left" },
  "match-parent": { textAlign: "match-parent" },
  right: { textAlign: "right" },
  start: { textAlign: "start" },
};

export const ParagraphTypography: Record<
  NonNullable<ParagraphProps["typography"]>,
  React.CSSProperties
> = {
  t1: { fontSize: "2rem", lineHeight: "2.5rem" },
  t2: { fontSize: "1.5rem", lineHeight: "2rem" },
  t3: { fontSize: "1.25rem", lineHeight: "1.75rem" },
  t4: { fontSize: "1rem", lineHeight: "1.5rem" },
  t5: { fontSize: "0.875rem", lineHeight: "1.25rem" },
  t6: { fontSize: "0.75rem", lineHeight: "1rem" },
  t7: { fontSize: "0.625rem", lineHeight: "0.875rem" },

  st1: { fontSize: "2.5rem", lineHeight: "3rem" },
  st2: { fontSize: "2.25rem", lineHeight: "2.75rem" },
  st3: { fontSize: "2rem", lineHeight: "2.5rem" },
  st4: { fontSize: "1.75rem", lineHeight: "2.25rem" },
  st5: { fontSize: "1.5rem", lineHeight: "2rem" },
  st6: { fontSize: "1.25rem", lineHeight: "1.75rem" },
  st7: { fontSize: "1rem", lineHeight: "1.5rem" },
  st8: { fontSize: "0.875rem", lineHeight: "1.25rem" },
  st9: { fontSize: "0.75rem", lineHeight: "1rem" },
  st10: { fontSize: "0.625rem", lineHeight: "0.875rem" },
  st11: { fontSize: "0.5rem", lineHeight: "0.75rem" },
  st12: { fontSize: "0.375rem", lineHeight: "0.5rem" },
  st13: { fontSize: "0.25rem", lineHeight: "0.375rem" },
};

export const ParagraphFontWeight: Record<
  NonNullable<ParagraphProps["fontWeight"]>,
  React.CSSProperties
> = {
  regular: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  semibold: { fontWeight: 600 },
  bold: { fontWeight: 700 },
};

export const ParagraphDisplay: Record<
  NonNullable<ParagraphProps["display"]>,
  React.CSSProperties
> = {
  block: { display: "block" },
  inline: { display: "inline" },
};

export const ParagraphColor: Record<
  NonNullable<ParagraphProps["color"]>,
  React.CSSProperties
> = {
  primary: { color: "var(--primary)" },
  destructive: { color: "var(--destructive)" },
  info: { color: "var(--info)" },
  neutral: { color: "var(--neutral)" },
  secondary: { color: "var(--secondary)" },
  success: { color: "var(--success)" },
  warning: { color: "var(--warning)" },
  white: { color: "var(--white)" },
};
