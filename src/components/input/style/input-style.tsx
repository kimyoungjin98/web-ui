import type { ReactNode } from "react";

import { cn } from "../../../libs/tailwind-util";
import { getFormSize, type FormSize } from "../../form-size";

type InputStyleOptions = {
  className?: string;
  endIcon?: boolean;
  size?: FormSize;
  startIcon?: boolean;
};

type InputFrameProps = {
  children: ReactNode;
  endIcon?: ReactNode;
  size?: FormSize;
  startIcon?: ReactNode;
};

function getInputBaseClassName(className?: string) {
  return cn(
    "w-full rounded-lg border-2 border-input transition-all focus-within:border-primary bg-card font-medium outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );
}

function getInputClassName({
  className,
  endIcon,
  size = "default",
  startIcon,
}: InputStyleOptions) {
  const sizeStyle = getFormSize(size);

  return cn(
    getInputBaseClassName(),
    sizeStyle.height,
    sizeStyle.inputPadding,
    sizeStyle.text,
    startIcon && "pl-8",
    endIcon && "pr-8",
    className,
  );
}

function InputFrame({
  children,
  endIcon,
  size = "default",
  startIcon,
}: InputFrameProps) {
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
      {children}
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

export {
  getInputBaseClassName,
  getInputClassName,
  InputFrame,
  type InputFrameProps,
  type InputStyleOptions,
};
