import type { ComponentProps, ReactNode } from "react";

import { cn } from "../libs/tailwind-util";
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
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-5">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

export type FormItemProps = {
  children: ReactNode;
  className?: string;
  hint?: ReactNode;
  hintVariant?: ComponentProps<typeof Hint>["variant"];
  htmlFor?: string;
  label: string;
  required?: boolean;
};

export function FormItem({
  label,
  required = false,
  children,
  className,
  hint,
  hintVariant = "default",
  htmlFor,
}: FormItemProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label
        className="text-sm font-semibold text-muted-foreground"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {hint ? <Hint variant={hintVariant}>{hint}</Hint> : null}
      {children}
    </div>
  );
}
