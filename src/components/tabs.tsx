"use client";

import * as React from "react";

import { cn } from "../libs/tailwind-util";
import { useUiSize } from "../providers/ui-size-provider";
import type { FormSize } from "./form-size";

type TabOption<TValue extends string> = {
  disabled?: boolean;
  label: React.ReactNode;
  value: TValue;
};

type TabsProps<TValue extends string> = {
  "aria-label": string;
  className?: string;
  onValueChange: (value: TValue) => void;
  options: TabOption<TValue>[];
  size?: FormSize;
  triggerClassName?: string;
  value: TValue | "";
};

const tabsSizeTokens: Record<FormSize, { label: string; trigger: string }> = {
  xs: { label: "text-xs", trigger: "px-2 py-1" },
  sm: { label: "text-sm", trigger: "px-2.5 py-1.5" },
  default: { label: "text-sm", trigger: "px-3 py-2" },
  lg: { label: "text-base", trigger: "px-4 py-2.5" },
};

function Tabs<TValue extends string>({
  "aria-label": ariaLabel,
  className,
  onValueChange,
  options,
  size,
  triggerClassName,
  value,
}: TabsProps<TValue>) {
  const resolvedSize = useUiSize("tabs", size, "default");
  const sizeToken = tabsSizeTokens[resolvedSize];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="tabs"
      className={cn(
        "flex min-w-0 w-full rounded-lg bg-muted p-1 gap-1 sm:w-max",
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
            data-value={option.value}
            className={cn(
              "cursor-pointer flex flex-1 items-center justify-center whitespace-nowrap rounded-md font-normal transition-colors outline-none motion-reduce:transition-none sm:flex-none",
              sizeToken.trigger,
              "text-secondary-foreground hover:text-foreground hover:bg-card/50",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
              selected &&
                "bg-card text-foreground font-medium hover:text-foreground hover:bg-card",
              triggerClassName,
            )}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) =>
              handleSegmentedControlKeyDown(event, options, onValueChange)
            }
          >
            <span className={sizeToken.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function handleSegmentedControlKeyDown<TValue extends string>(
  event: React.KeyboardEvent<HTMLButtonElement>,
  options: TabOption<TValue>[],
  onValueChange: (value: TValue) => void,
) {
  const enabled = options.filter((option) => !option.disabled);
  if (enabled.length === 0) return;

  const current = enabled.findIndex(
    (option) => option.value === event.currentTarget.dataset.value,
  );
  const nextIndex =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? (current + 1) % enabled.length
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? (current - 1 + enabled.length) % enabled.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? enabled.length - 1
            : -1;

  if (nextIndex < 0) return;

  event.preventDefault();
  const next = enabled[nextIndex]!;
  onValueChange(next.value);
  const group = event.currentTarget.closest("[data-slot='tabs']");
  const nextButton = group?.querySelector<HTMLButtonElement>(
    `[data-value="${CSS.escape(next.value)}"]`,
  );
  nextButton?.focus();
}

export { Tabs };
export type { TabOption, TabsProps, FormSize as TabsSize };
