import { cn } from "../../../libs/tailwind-util";
import { Icon } from "../../icon";
import { ParagraphTypography } from "../paragraph.styles";
import type { ParagraphIconProps } from "./paragraph-icon.types";

export function ParagraphIcon({
  name,
  id,
  style,
  className,
  typography,
}: ParagraphIconProps) {
  return (
    <span
      id={id}
      className={cn("inline-flex align-text-bottom", className)}
      style={{
        ...(typography ? ParagraphTypography[typography] : {}),
        width: "1em",
        height: "1em",
        ...style,
      }}
    >
      <Icon name={name} className="size-full" />
    </span>
  );
}
