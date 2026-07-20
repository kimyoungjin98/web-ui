import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../../libs/tailwind-util";
import { buttonBase, buttonSizes, buttonVariantBase } from "./base";
import { getButtonColorClass } from "./colors";
import type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, color, variant = "solid", size, asChild = false, ...props },
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
  color?: ButtonColor | string;
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
  color: ButtonColor | string | undefined,
  variant: ButtonVariant,
): ButtonColor {
  if (color === "primary" || color === "secondary" || color === "neutral") {
    return color;
  }

  return variant === "solid" || variant === "default" ? "primary" : "neutral";
}

export { Button, buttonVariants };
