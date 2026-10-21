import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../libs/tailwind-util";
import Icon from "./icon";

const hintVariants = cva(
  "flex items-start gap-2 rounded-lg px-3 py-2.5 text-[13px] font-normal leading-5 text-base-content shadow-none [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_[data-slot=icon]]:mt-0.5 [&_[data-slot=icon]]:size-4 [&_[data-slot=icon]]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-muted [&_svg]:text-muted-foreground [&_[data-slot=icon]]:text-muted-foreground",
        info: "bg-info [&_svg]:text-info-foreground [&_[data-slot=icon]]:text-info-foreground",
        warning:
          "bg-warning [&_svg]:text-warning-foreground [&_[data-slot=icon]]:text-warning-foreground",
        success:
          "bg-success [&_svg]:text-success-foreground [&_[data-slot=icon]]:text-success-foreground",
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
