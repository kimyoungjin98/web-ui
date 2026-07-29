import * as React from "react";

import { cn } from "../libs/tailwind-util";

export type BadgeVariant = "outline" | "solid";
export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "neutral";

const baseClassName =
  "select-none inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:size-3";

const solidColorClassNames: Record<BadgeColor, string> = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-white",
  success: "border-transparent bg-green-600 text-white",
  warning: "border-transparent bg-orange-500 text-white",
  danger: "border-transparent bg-red-500 text-white",
  blue: "border-transparent bg-blue-500 text-white",
  neutral: "border-transparent bg-muted text-muted-foreground",
};

const outlineColorClassNames: Record<BadgeColor, string> = {
  primary: "border-primary-border/50 bg-primary-soft text-primary-foreground",
  secondary: "border-secondary bg-secondary/30 text-secondary-foreground/70",
  success: "border-green-200 bg-green-50 text-green-600",
  warning: "border-orange-200 bg-orange-50 text-orange-600",
  danger: "border-red-200 bg-red-50 text-red-600",
  blue: "border-blue-200 bg-blue-50 text-blue-600",
  neutral: "border-border bg-transparent text-muted-foreground",
};

function Badge({
  className,
  variant = "outline",
  color = "primary",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: BadgeVariant;
  color?: BadgeColor;
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
