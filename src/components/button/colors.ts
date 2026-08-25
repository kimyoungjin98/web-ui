import type { ColorToken } from "../../themes/color-token";
import type { ButtonVariant } from "./types";

const solid: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-95",
  success: "bg-success text-success-foreground hover:brightness-95",
  warning: "bg-warning text-warning-foreground hover:brightness-95",
  destructive: "bg-destructive text-destructive-foreground hover:brightness-95",
  info: "bg-info text-info-foreground hover:brightness-95",
  neutral: "bg-neutral text-neutral-foreground hover:brightness-95",
  white: "bg-white text-white-foreground hover:bg-white-hover",
};

const outline: Record<ColorToken, string> = {
  primary:
    "border-primary/30 bg-primary10 text-primary-soft-foreground hover:bg-primary/20",
  secondary:
    "border-secondary/30 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
  success:
    "border-success/30 bg-success/10 text-success-soft-foreground hover:bg-success/20",
  warning:
    "border-warning/30 bg-warning/10 text-warning-soft-foreground hover:bg-warning/20",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive-soft-foreground hover:bg-destructive/20",
  info: "border-info/30 bg-info/10 text-info-soft-foreground hover:bg-info/20",
  neutral: "border-neutral/15 bg-neutral/5 text-neutral hover:bg-neutral/10",
  white: "border-border bg-card text-base-content hover:bg-neutral/10",
};

const ghost: Record<ColorToken, string> = {
  primary: "text-primary-soft-foreground hover:bg-primary-soft",
  secondary: "text-secondary-foreground hover:bg-secondary",
  success: "text-success-soft-foreground hover:bg-success/10",
  warning: "text-warning-soft-foreground hover:bg-warning/10",
  destructive: "text-destructive-soft-foreground hover:bg-destructive/10",
  info: "text-info-soft-foreground hover:bg-info/10",
  neutral: "text-neutral hover:bg-muted-foreground/20",
  white: "text-white hover:bg-white/20",
};

const link: Record<ColorToken, string> = {
  primary: "text-link",
  secondary: "text-secondary-foreground",
  success: "text-success-soft-foreground",
  warning: "text-warning-soft-foreground",
  destructive: "text-destructive-soft-foreground",
  info: "text-info-soft-foreground",
  neutral: "text-neutral",
  white: "text-white",
};

export function getButtonColorClass(variant: ButtonVariant, color: ColorToken) {
  return { ghost, link, outline, solid }[variant][color];
}
