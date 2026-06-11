import type * as React from "react";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonColor = "primary" | "secondary" | "neutral";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
};
