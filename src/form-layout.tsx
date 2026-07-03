import type { ComponentProps, ReactNode } from "react";

import { cn } from "./lib/tailwind-util";
import { Hint } from "./hint";

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-white px-5 py-4">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function FormItem({
  label,
  required = false,
  children,
  className,
  hint,
  hintVariant = "default",
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: ReactNode;
  hintVariant?: ComponentProps<typeof Hint>["variant"];
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      {hint ? <Hint variant={hintVariant}>{hint}</Hint> : null}
      {children}
    </label>
  );
}
