import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Icon from "./icon";
import { cn } from "../libs/tailwind-util";
import type { ColorToken } from "../themes/color-token";

type MetricCardProps = React.ComponentProps<typeof Card> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: string;
  tone?: ColorToken;
  valueClassName?: string;
};

const toneClassNames: Record<ColorToken, string> = {
  primary: "border-primary-border bg-primary-soft text-primary",
  secondary: "border-border bg-secondary text-secondary-foreground",
  success: "border-success bg-success/20 text-success-foreground",
  warning: "border-warning bg-warning/20 text-warning-foreground",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-info bg-info/20 text-info-foreground",
  neutral: "border-neutral/30 bg-neutral/10 text-neutral",
};

function MetricCard({
  label,
  value,
  icon,
  tone = "neutral",
  className,
  valueClassName,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn(className)} {...props}>
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

export { MetricCard };
export type { MetricCardProps };
