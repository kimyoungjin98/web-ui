import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../../libs/tailwind-util";
import type { ColorToken } from "../../themes/color-token";
import { buttonBase, buttonSizes, buttonVariantBase } from "./base";
import { getButtonColorClass } from "./colors";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      color,
      variant = "solid",
      size,
      asChild = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedColor = resolveButtonColor(color, variant);

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          buttonBase,
          buttonVariantBase[variant],
          getButtonColorClass(variant, resolvedColor),
          buttonSizes[size ?? "default"],
          className,
          disabled && "cursor-not-allowed pointer-events-none opacity-50",
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

function buttonVariants({
  className,
  color,
  size,
  variant = "solid",
}: {
  className?: string;
  color?: ColorToken;
  size?: ButtonSize;
  variant?: ButtonVariant;
} = {}) {
  const resolvedColor = resolveButtonColor(color, variant);

  return cn(
    buttonBase,
    buttonVariantBase[variant],
    getButtonColorClass(variant, resolvedColor),
    buttonSizes[size ?? "default"],
    className,
  );
}

function resolveButtonColor(
  color: ColorToken | undefined,
  variant: ButtonVariant,
): ColorToken {
  return (
    color ??
    (variant === "solid" || variant === "default" ? "primary" : "neutral")
  );
}

export { Button, buttonVariants };
