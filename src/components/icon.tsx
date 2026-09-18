import type { SVGProps } from "react";
import { cn } from "../libs/tailwind-util";
import { iconData } from "./icon-data.generated";
import type { IconName } from "./icon-manifest";

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "children" | "dangerouslySetInnerHTML" | "name"
> {
  name: IconName;
}

/**
 * 빌드 시 생성된 Iconify SVG 데이터를 렌더링하는 아이콘 컴포넌트
 * 단색 아이콘은 className의 text 색상을 따릅니다.
 *
 * @example
 * <Icon name="mdi:home" className="size-6 text-primary" />
 */
export const Icon = ({ name, className = "size-4", ...props }: IconProps) => {
  const icon = iconData[name];

  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn("inline-block", className)}
      focusable="false"
      viewBox={icon.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
};

export type { IconName };

export default Icon;
