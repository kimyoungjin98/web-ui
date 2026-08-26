"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../libs/tailwind-util";
import { useUiSize } from "../providers/ui-size-provider";

type ToggleSize = "sm" | "md" | "lg";

type ToggleProps = Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  "children"
> & {
  children?: React.ReactNode;
  containerClassName?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  size?: ToggleSize;
};

const toggleSizeTokens: Record<
  ToggleSize,
  { root: string; thumb: string; thumbChecked: string }
> = {
  sm: {
    root: "h-5 w-8",
    thumb: "size-4 translate-x-0.5",
    thumbChecked: "data-[state=checked]:translate-x-3.5",
  },
  md: {
    root: "h-6 w-10",
    thumb: "size-5 translate-x-0.5",
    thumbChecked: "data-[state=checked]:translate-x-4.5",
  },
  lg: {
    root: "h-7 w-12",
    thumb: "size-6 translate-x-0.5",
    thumbChecked: "data-[state=checked]:translate-x-5.5",
  },
};

function Toggle({
  children,
  className,
  containerClassName,
  disabled,
  label,
  labelClassName,
  size,
  ...props
}: ToggleProps) {
  const resolvedSize = useUiSize("toggle", size, "md");
  const sizeToken = toggleSizeTokens[resolvedSize];
  const content = label ?? children;

  return (
    <label
      className={cn(
        "inline-flex w-fit select-none items-center gap-2.5 text-sm font-medium text-base-content",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        containerClassName,
      )}
    >
      <SwitchPrimitive.Root
        data-slot="toggle"
        disabled={disabled}
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-input bg-muted outline-none transition-colors duration-200 data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed motion-reduce:transition-none",
          sizeToken.root,
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="toggle-thumb"
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform duration-200 motion-reduce:transition-none",
            sizeToken.thumb,
            sizeToken.thumbChecked,
          )}
        />
      </SwitchPrimitive.Root>
      {content ? (
        <span className={cn("min-w-0 leading-5", labelClassName)}>
          {content}
        </span>
      ) : null}
    </label>
  );
}

export { Toggle };
export type { ToggleProps, ToggleSize };
