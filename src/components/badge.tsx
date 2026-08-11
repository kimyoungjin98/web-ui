import * as React from "react";

import { cn } from "../libs/tailwind-util";
import type { ColorToken } from "../themes/color-token";

export type BadgeVariant = "outline" | "solid";

const baseClassName =
  "select-none inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:size-3";

const solidColorClassNames: Record<ColorToken, string> = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  info: "border-transparent bg-info text-info-foreground",
  neutral: "border-transparent bg-neutral text-neutral-foreground",
};

const outlineColorClassNames: Record<ColorToken, string> = {
  primary: "border-primary-border/50 bg-primary-soft text-primary",
  secondary: "border-secondary bg-secondary/30 text-secondary-foreground/70",
  success: "border-success bg-success/10 text-success-soft-foreground",
  warning: "border-warning bg-warning/10 text-warning-soft-foreground",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive-soft-foreground",
  info: "border-info bg-info/10 text-info-soft-foreground",
  neutral: "border-neutral/30 bg-neutral/10 text-neutral",
};

function Badge({
  className,
  variant = "outline",
  color = "primary",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: BadgeVariant;
  color?: ColorToken;
}) {
  return (
    <span
      data-slot="badge"
      className={cn(
        baseClassName,
        variant === "solid"
          ? solidColorClassNames[color]
          : outlineColorClassNames[color],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
