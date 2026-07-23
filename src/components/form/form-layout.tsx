import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "../../libs/tailwind-util";
import { Hint } from "../hint";

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-md border border-border bg-card shadow-sm"
    >
      <div className="border-b border-border bg-card px-4 py-4 sm:px-5">
        <h3 id={titleId} className="text-base font-bold text-foreground">
          {title}
        </h3>
      </div>
      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

export type FormItemProps = {
  children: ReactNode;
  className?: string;
  error?: ReactNode;
  errorId?: string;
  hint?: ReactNode;
  hintId?: string;
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
  error,
  errorId,
  hint,
  hintId,
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
      {hint ? (
        <Hint id={hintId} variant={hintVariant}>
          {hint}
        </Hint>
      ) : null}
      {children}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
