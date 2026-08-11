import type * as React from "react";
import type { ColorToken } from "../../themes/color-token";

export type ButtonVariant =
  | "solid"
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "destructive"
  | "link";
export type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon";

export type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  color?: ColorToken;
  size?: ButtonSize;
  variant?: ButtonVariant;
};
