import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../libs/tailwind-util";
import Icon from "./icon";

const hintVariants = cva(
  "flex items-start gap-2 rounded-md px-3 py-2.5 text-[13px] font-medium leading-5 text-[#37352f] shadow-none [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_[data-slot=icon]]:mt-0.5 [&_[data-slot=icon]]:size-4 [&_[data-slot=icon]]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#f7f6f3] [&_svg]:text-[#787774] [&_[data-slot=icon]]:text-[#787774]",
        info: "bg-[#f3f6fb] [&_svg]:text-[#337ea9] [&_[data-slot=icon]]:text-[#337ea9]",
        warning:
          "bg-[#fbf3db] [&_svg]:text-[#cb912f] [&_[data-slot=icon]]:text-[#cb912f]",
        success:
          "bg-[#edf3ec] [&_svg]:text-[#448361] [&_[data-slot=icon]]:text-[#448361]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type HintVariant = NonNullable<VariantProps<typeof hintVariants>["variant"]>;

const defaultIcons = {
  default: (
    <Icon
      name="material-symbols-light:notifications"
      className="mt-0.5 size-4 shrink-0"
    />
  ),
  info: <Icon name="lucide:info" className="mt-0.5 size-4 shrink-0" />,
  warning: (
    <Icon name="lucide:triangle-alert" className="mt-0.5 size-4 shrink-0" />
  ),
  success: (
    <Icon name="lucide:check-circle-2" className="mt-0.5 size-4 shrink-0" />
  ),
} satisfies Record<HintVariant, React.ReactNode>;

type HintProps = React.ComponentProps<"div"> &
  VariantProps<typeof hintVariants> & {
    icon?: React.ReactNode | false;
  };

function Hint({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: HintProps) {
  const hintVariant: HintVariant = variant ?? "default";
  const renderedIcon =
    icon === false ? null : (icon ?? defaultIcons[hintVariant]);

  return (
    <div
      data-slot="hint"
      className={cn(hintVariants({ variant: hintVariant, className }))}
      {...props}
    >
      {renderedIcon}
      <div className="min-w-0 flex-1 mt-0.5 whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}

export { Hint };
