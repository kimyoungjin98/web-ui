import { ColorToken } from "../../../themes/color-token";
import { ParagraphFontWeight, ParagraphTypography } from "../paragraph.types";

export type ParagraphTextProps = {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  typography?: ParagraphTypography;
  fontWeight?: ParagraphFontWeight;
  color?: ColorToken;
};
