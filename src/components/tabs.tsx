import * as React from "react";

import { cn } from "../libs/tailwind-util";

type TabOption<TValue extends string> = {
  disabled?: boolean;
  label: React.ReactNode;
  value: TValue;
};

type TabsProps<TValue extends string> = {
  "aria-label"?: string;
  className?: string;
  onValueChange: (value: TValue) => void;
  options: TabOption<TValue>[];
  triggerClassName?: string;
  value: TValue | "";
};

function Tabs<TValue extends string>({
  "aria-label": ariaLabel,
  className,
  onValueChange,
  options,
  triggerClassName,
  value,
}: TabsProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="tabs"
      className={cn(
        "flex min-w-0 w-full rounded-md bg-gray-100 p-1 gap-1 sm:w-max",
        className,
      )}
    >
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            disabled={option.disabled}
            data-slot="tabs-trigger"
            data-state={selected ? "active" : "inactive"}
            className={cn(
              "flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold transition-colors outline-none sm:flex-none",
              "text-muted-foreground hover:text-foreground hover:bg-background",
              "focus-visible:ring-3 focus-visible:ring-ring/15 focus-visible:border-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              selected &&
                "bg-background text-foreground hover:bg-background *:font-semibold",
              triggerClassName,
            )}
            onClick={() => onValueChange(option.value)}
          >
            <span className="text-sm">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { Tabs };
export type { TabOption, TabsProps };
