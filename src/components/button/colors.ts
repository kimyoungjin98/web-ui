import type { ColorToken } from "../../themes/color-token";
import type { ButtonVariant } from "./types";

const solid: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  success: "bg-success text-success-foreground hover:bg-success/80",
  warning: "bg-warning text-warning-foreground hover:bg-warning/80",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  info: "bg-info text-info-foreground hover:bg-info/80",
  neutral: "bg-neutral text-neutral-foreground hover:bg-neutral/90",
};

const outline: Record<ColorToken, string> = {
  primary:
    "border-primary-border bg-background text-primary-soft-foreground hover:bg-primary-soft",
  secondary:
    "border-border bg-background text-secondary-foreground hover:bg-secondary",
  success:
    "border-success bg-success/10 text-success-soft-foreground hover:bg-success/20",
  warning:
    "border-warning bg-warning/10 text-warning-soft-foreground hover:bg-warning/20",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive-soft-foreground hover:bg-destructive/20",
  info: "border-info bg-info/10 text-info-soft-foreground hover:bg-info/20",
  neutral: "border-input bg-card text-neutral hover:bg-muted",
};

const ghost: Record<ColorToken, string> = {
  primary: "text-primary-soft-foreground hover:bg-primary-soft",
  secondary: "text-secondary-foreground hover:bg-secondary",
  success: "text-success-soft-foreground hover:bg-success/10",
  warning: "text-warning-soft-foreground hover:bg-warning/10",
  destructive: "text-destructive-soft-foreground hover:bg-destructive/10",
  info: "text-info-soft-foreground hover:bg-info/10",
  neutral: "text-neutral hover:bg-muted-foreground/20",
};

export function getButtonColorClass(variant: ButtonVariant, color: ColorToken) {
  if (variant === "default") return solid.primary;
  if (variant === "secondary") return solid.secondary;
  if (variant === "destructive") return solid.destructive;
  if (variant === "link") return "text-link";

  return { ghost, outline, solid }[variant][color];
}
