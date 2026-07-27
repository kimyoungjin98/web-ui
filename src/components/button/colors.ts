import type { ButtonColor, ButtonVariant } from "./types";

const solid: Record<ButtonColor, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  neutral: "bg-foreground text-background hover:bg-foreground/90",
};

const outline: Record<ButtonColor, string> = {
  primary:
    "border-primary-border bg-background text-primary-hover hover:bg-primary-soft",
  secondary:
    "border-border bg-background text-secondary-foreground hover:bg-secondary",
  neutral: "border-input bg-card hover:bg-muted",
};

const ghost: Record<ButtonColor, string> = {
  primary: "text-primary-hover hover:bg-primary-soft",
  secondary: "text-secondary-foreground hover:bg-secondary",
  neutral: "hover:bg-muted-foreground/20",
};

export function getButtonColorClass(
  variant: ButtonVariant,
  color: ButtonColor,
) {
  if (variant === "default") return solid.primary;
  if (variant === "secondary") return solid.secondary;
  if (variant === "destructive")
    return "bg-destructive text-primary-foreground hover:bg-destructive/90";
  if (variant === "link") return "text-link";

  return { ghost, outline, solid }[variant][color];
}
