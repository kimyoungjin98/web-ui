import * as React from "react";

import { cn } from "./lib/tailwind-util";
import Icon from "./icon";

type CheckboxSize = "sm" | "md" | "lg";

type CheckboxProps = Omit<React.ComponentProps<"input">, "size" | "type"> & {
  label?: React.ReactNode;
  labelClassName?: string;
  size?: CheckboxSize;
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
  className,
  label,
  labelClassName,
  disabled,
  size = "md",
  ...props
}: CheckboxProps) {
  const sizeToken = checkboxSizeTokens[size];

  return (
    <label
      className={cn(
        "group select-none flex cursor-pointer items-center rounded-md border border-input bg-background font-semibold text-foreground transition-all hover:bg-gray-50 has-[:checked]:border-primary-border has-[:checked]:bg-primary/10 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/15",
        sizeToken.label,
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
          type="checkbox"
          disabled={disabled}
          className={cn(
            "peer absolute inset-0 size-full cursor-pointer appearance-none rounded border border-input bg-background outline-none transition-all checked:border-primary checked:bg-primary disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <Icon
          name="mdi:check"
          className={cn(
            "pointer-events-none opacity-0 text-white transition-opacity peer-checked:opacity-100",
            sizeToken.icon,
          )}
        />
      </span>
      {label ? (
        <span className="min-w-0 leading-5 mt-0.5 font-semibold text-sm">
          {label}
        </span>
      ) : null}
    </label>
  );
}

export { Checkbox };
