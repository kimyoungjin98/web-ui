import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/tailwind-util";
import { buttonBase, buttonSizes, buttonVariantBase } from "./base";
import { getButtonColorClass } from "./colors";
import type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./types";

export function Button({
  className,
  color,
  variant = "solid",
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const resolvedColor = color ?? getDefaultColor(variant);

  return (
    <Comp
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
}

function buttonVariants({
  className,
  color,
  size,
  variant = "solid",
}: {
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
} = {}) {
  const resolvedColor = color ?? getDefaultColor(variant);

  return cn(
    buttonBase,
    buttonVariantBase[variant],
    getButtonColorClass(variant, resolvedColor),
    buttonSizes[size ?? "default"],
    className,
  );
}

function getDefaultColor(variant: ButtonVariant): ButtonColor {
  return variant === "solid" ? "primary" : "neutral";
}

export { buttonVariants };
