"use client";

import * as React from "react";

import { cn } from "../libs/tailwind-util";
import Icon from "./icon";
import { useUiSize } from "../providers/ui-size-provider";

type CheckboxSize = "sm" | "md" | "lg";

type CheckboxProps = Omit<React.ComponentProps<"input">, "size" | "type"> & {
  children?: React.ReactNode;
  containerClassName?: string;
  indeterminate?: boolean;
  label?: string;
  labelClassName?: string;
  size?: CheckboxSize;
  title?: string;
};

const checkboxSizeTokens: Record<
  CheckboxSize,
  { icon: string; label: string; mark: string }
> = {
  sm: { icon: "size-4", label: "min-h-8 gap-2 px-3 text-xs", mark: "size-4" },
  md: {
    icon: "size-4",
    label: "min-h-10 gap-2.5 px-3.5 text-sm",
    mark: "size-4",
  },
  lg: { icon: "size-5", label: "min-h-11 gap-3 px-4 text-sm", mark: "size-5" },
};

function Checkbox({
  children,
  className,
  containerClassName,
  indeterminate = false,
  label,
  labelClassName,
  disabled,
  title,
  size,
  ...props
}: CheckboxProps) {
  const resolvedSize = useUiSize("checkbox", size, "md");
  const sizeToken = checkboxSizeTokens[resolvedSize];
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      title={title || label}
      className={cn(
        "group select-none flex cursor-pointer items-center rounded-lg bg-background font-semibold text-base-content transition-all hover:bg-muted has-[:checked]:border-primary-border has-[:checked]:bg-primary/10 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/15",
        sizeToken.label,
        containerClassName,
        labelClassName,
      )}
    >
      <span
        className={cn(
          "relative grid shrink-0 place-items-center",
          sizeToken.mark,
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : undefined}
          className={cn(
            "peer absolute inset-0 size-full cursor-pointer appearance-none rounded border-2 border-input bg-background outline-none transition-all checked:border-primary checked:bg-primary disabled:cursor-not-allowed",
            indeterminate && "border-primary bg-primary",
            className,
          )}
          {...props}
        />
        <Icon
          name="mdi:check"
          className={cn(
            "pointer-events-none relative opacity-0 text-primary-foreground transition-opacity peer-checked:opacity-100",
            indeterminate && "opacity-100",
            sizeToken.icon,
          )}
        />
      </span>
      {label || children ? (
        <span className="min-w-0 leading-5 font-medium text-sm">
          {label || children}
        </span>
      ) : null}
    </label>
  );
}

export { Checkbox };
export type { CheckboxProps, CheckboxSize };
