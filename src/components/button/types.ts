import type * as React from "react";

export type ButtonVariant =
  | "solid"
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "destructive"
  | "link";
export type ButtonColor = "primary" | "secondary" | "neutral";
export type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon";

export type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  color?: ButtonColor | string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};
