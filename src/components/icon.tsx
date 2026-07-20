import type { CSSProperties } from "react";

export interface IconProps {
  name: string;
  className?: string;
}

/**
 * Iconify 아이콘 컴포넌트
 * CSS mask를 사용하여 className으로 색상 변경 가능
 *
 * @example
 * <Icon name="mdi:home" className="size-6 text-primary" />
 */
export const Icon = ({ name, className = "size-4" }: IconProps) => {
  const src = encodeURI(`https://api.iconify.design/${name}.svg`);

  return (
    <span
      aria-hidden="true"
      className={`icon-mask ${className}`}
      style={{ "--icon-url": `url(${src})` } as CSSProperties}
    />
  );
};

export default Icon;
