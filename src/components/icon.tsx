import type { CSSProperties } from "react";

export type IconName = string;

export interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className = "size-4" }: IconProps) => {
  const separatorIndex = name.indexOf(":");

  if (separatorIndex === -1) {
    console.warn(`[Icon] Invalid Iconify icon name: "${name}"`);
    return null;
  }

  const prefix = name.slice(0, separatorIndex);
  const iconName = name.slice(separatorIndex + 1);

  const src = `https://api.iconify.design/${encodeURIComponent(prefix)}/${encodeURIComponent(iconName)}.svg`;

  return (
    <span
      aria-hidden="true"
      className={`
    inline-block
    bg-current
    [mask-image:var(--icon-url)]
    [mask-repeat:no-repeat]
    [mask-position:center]
    [mask-size:contain]
    [-webkit-mask-image:var(--icon-url)]
    [-webkit-mask-repeat:no-repeat]
    [-webkit-mask-position:center]
    [-webkit-mask-size:contain]
    ${className}
  `}
      style={
        {
          "--icon-url": `url("${src}")`,
        } as CSSProperties
      }
    />
  );
};

export default Icon;
