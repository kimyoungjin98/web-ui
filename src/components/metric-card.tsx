import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Icon from "./icon";
import { cn } from "../libs/tailwind-util";
import type { ColorToken } from "../themes/color-token";

type MetricCardProps = React.ComponentProps<typeof Card> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: string;
  interactive?: boolean;
  tone?: ColorToken;
  valueClassName?: string;
};

const ACTIVE_METRIC_CARD_CLASS_NAME =
  "border-primary/40 bg-primary/5 shadow-md hover:border-primary/40 hover:bg-primary/5 hover:shadow-md";

const toneClassNames: Record<ColorToken, string> = {
  primary: "border-primary-border bg-primary-soft text-primary-soft-foreground",
  secondary: "border-border bg-secondary text-secondary-foreground",
  success: "border-success bg-success/20 text-success-soft-foreground",
  warning: "border-warning bg-warning/20 text-warning-soft-foreground",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive-soft-foreground",
  info: "border-info bg-info/20 text-info-soft-foreground",
  neutral: "border-neutral/30 bg-neutral/10 text-neutral",
  white: "border-border bg-card text-base-content",
};

function MetricCard({
  label,
  value,
  icon,
  interactive = false,
  tone = "neutral",
  className,
  onKeyDown,
  role,
  tabIndex,
  valueClassName,
  ...props
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        interactive &&
          "cursor-pointer select-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/40 hover:shadow-md",
        className,
      )}
      role={interactive ? "button" : role}
      tabIndex={interactive ? 0 : tabIndex}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          interactive &&
          !event.defaultPrevented &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      {...props}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {label}
        </CardTitle>
        {icon ? (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-md border",
              toneClassNames[tone],
            )}
          >
            <Icon name={icon} className="size-4" />
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-medium leading-none text-base-content",
            valueClassName,
          )}
        >
          {value ?? "-"}
        </p>
      </CardContent>
    </Card>
  );
}

export { ACTIVE_METRIC_CARD_CLASS_NAME, MetricCard };
export type { MetricCardProps };
