import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Icon from "./icon";
import { cn } from "../libs/tailwind-util";

type MetricCardTone = "default" | "blue" | "green" | "red" | "orange";

type MetricCardProps = React.ComponentProps<typeof Card> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: string;
  tone?: MetricCardTone;
  valueClassName?: string;
};

const toneClassNames: Record<MetricCardTone, string> = {
  default: "border-border bg-muted text-muted-foreground",
  blue: "border-sky-100 bg-sky-50 text-sky-700",
  green: "border-green-100 bg-green-50 text-green-700",
  red: "border-red-100 bg-red-50 text-red-700",
  orange: "border-orange-100 bg-orange-50 text-orange-700",
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
export type { MetricCardProps, MetricCardTone };
