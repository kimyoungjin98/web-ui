import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Icon from "./icon";
import { cn } from "../libs/tailwind-util";

type MetricCardTone = "default" | "brand" | "sky" | "amber" | "rose";

type MetricCardProps = React.ComponentProps<typeof Card> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: string;
  tone?: MetricCardTone;
  valueClassName?: string;
};

const toneClassNames: Record<MetricCardTone, string> = {
  default: "border-border bg-muted text-muted-foreground",
  brand: "border-primary-border bg-primary-soft text-primary-hover",
  sky: "border-sky-100 bg-sky-50 text-sky-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
};

function MetricCard({
  label,
  value,
  icon,
  tone = "default",
  className,
  valueClassName,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground">
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
            "text-2xl font-bold leading-none text-base-content",
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
export type { MetricCardProps, MetricCardTone };
