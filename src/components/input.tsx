import * as React from "react";

import { cn } from "../libs/tailwind-util";
import { getFormSize, type FormSize } from "./form-size";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: FormSize;
};

function Input({
  className,
  startIcon,
  endIcon,
  size = "default",
  ...props
}: InputProps) {
  const sizeStyle = getFormSize(size);

  return (
    <span className="relative block w-full">
      {startIcon ? (
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground",
            sizeStyle.icon,
          )}
        >
          {startIcon}
        </span>
      ) : null}
      <input
        data-slot="input"
        className={cn(
          "w-full rounded-md border border-input bg-card font-medium outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-ring focus:ring-3 focus:ring-ring/15",
          sizeStyle.height,
          sizeStyle.inputPadding,
          sizeStyle.text,
          startIcon && "pl-8",
          endIcon && "pr-8",
          className,
        )}
        {...props}
      />
      {endIcon ? (
        <span
          className={cn(
            "absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground",
            sizeStyle.icon.replace("left-", "right-"),
          )}
        >
          {endIcon}
        </span>
      ) : null}
    </span>
  );
}

export { Input };
