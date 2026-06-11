import * as React from "react";

import { cn } from "./lib/tailwind-util";

type InputProps = React.ComponentProps<"input"> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

function Input({ className, startIcon, endIcon, ...props }: InputProps) {
  return (
    <span className="relative block w-full">
      {startIcon ? (
        <span className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
          {startIcon}
        </span>
      ) : null}
      <input
        data-slot="input"
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background px-3 text-[14px] font-semibold outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-ring focus:ring-3 focus:ring-ring/15",
          startIcon && "pl-8",
          endIcon && "pr-8",
          className,
        )}
        {...props}
      />
      {endIcon ? (
        <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
          {endIcon}
        </span>
      ) : null}
    </span>
  );
}

export { Input };
