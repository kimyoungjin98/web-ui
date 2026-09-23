import { ParagraphIcon } from "./icon/paragraph-icon";
import {
  ParagraphColor,
  ParagraphDisplay,
  ParagraphFontWeight,
  ParagraphTextAlign,
  ParagraphTypography,
} from "./paragraph.styles";
import { ParagraphProps } from "./paragraph.types";
import { ParagraphText } from "./text/paragraph-text";

export type { ParagraphIconProps } from "./icon/paragraph-icon.types";

function ParagraphRoot(
  props: ParagraphProps & React.HTMLAttributes<HTMLParagraphElement>,
) {
  const {
    ellipsisAfterLines,
    typography,
    fontWeight,
    color,
    display,
    textAlign,
    ...rest
  } = props;

  return (
    <p
      {...rest}
      style={{
        ...(typography ? ParagraphTypography[typography] : {}),
        ...(fontWeight ? ParagraphFontWeight[fontWeight] : {}),
        ...(color ? ParagraphColor[color] : {}),
        ...(display ? ParagraphDisplay[display] : {}),
        ...(textAlign ? ParagraphTextAlign[textAlign] : {}),
        ...(ellipsisAfterLines && ellipsisAfterLines > 0
          ? {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: Math.floor(ellipsisAfterLines),
              overflow: "hidden",
            }
          : {}),
      }}
    >
      {props.children}
    </p>
  );
}

export const Paragraph = Object.assign(ParagraphRoot, {
  Text: ParagraphText,
  Icon: ParagraphIcon,
});
