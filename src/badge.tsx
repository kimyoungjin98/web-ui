import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/tailwind-util";

const badgeVariants = cva(
  "select-none inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "text-foreground",
        brand: "border-primary-border bg-primary-soft text-primary-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge };
