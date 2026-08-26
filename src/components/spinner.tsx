"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../libs/tailwind-util";
import { useUiSize } from "../providers/ui-size-provider";

const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type SpinnerProps = React.ComponentProps<"span"> &
  VariantProps<typeof spinnerVariants> & {
    label?: string;
    decorative?: boolean;
  };

function Spinner({
  className,
  decorative = false,
  label = "로딩 중",
  size,
  ...props
}: SpinnerProps) {
  const resolvedSize = useUiSize("spinner", size ?? undefined, "default");

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={cn(spinnerVariants({ size: resolvedSize, className }))}
      role={decorative ? undefined : "status"}
      {...props}
    />
  );
}

export { Spinner };
