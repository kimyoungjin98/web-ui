import type { ButtonColor, ButtonVariant } from "./types";

const solid: Record<ButtonColor, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  neutral: "bg-gray-900 text-white hover:bg-gray-800",
};

const outline: Record<ButtonColor, string> = {
  primary: "border-primary-border bg-background text-primary-hover hover:bg-primary-soft",
  secondary: "border-border bg-background text-secondary-foreground hover:bg-secondary",
  neutral: "border-input bg-background hover:bg-gray-100",
};

const ghost: Record<ButtonColor, string> = {
  primary: "text-primary-hover hover:bg-primary-soft",
  secondary: "text-secondary-foreground hover:bg-secondary",
  neutral: "hover:bg-gray-100",
};

export function getButtonColorClass(variant: ButtonVariant, color: ButtonColor) {
  return { ghost, outline, solid }[variant][color];
}
