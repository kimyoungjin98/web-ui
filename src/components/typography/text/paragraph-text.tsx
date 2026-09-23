import {
  ParagraphColor,
  ParagraphFontWeight,
  ParagraphTypography,
} from "../paragraph.styles";
import { ParagraphTextProps } from "./paragraph-text.types";

export function ParagraphText({
  children,
  className,
  color,
  fontWeight,
  typography,
  id,
  style,
  ...rest
}: ParagraphTextProps & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <span
      id={id}
      className={className}
      style={{
        ...style,
        ...(typography ? ParagraphTypography[typography] : {}),
        ...(fontWeight ? ParagraphFontWeight[fontWeight] : {}),
        ...(color ? ParagraphColor[color] : {}),
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
