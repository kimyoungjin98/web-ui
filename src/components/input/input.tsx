"use client";

import * as React from "react";

import { type FormSize } from "../form-size";
import { getInputClassName, InputFrame } from "./style/input-style";
import { useUiSize } from "../../providers/ui-size-provider";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: FormSize;
};

function Input({ className, startIcon, endIcon, size, ...props }: InputProps) {
  const resolvedSize = useUiSize("input", size, "default");

  return (
    <InputFrame endIcon={endIcon} size={resolvedSize} startIcon={startIcon}>
      <input
        data-slot="input"
        className={getInputClassName({
          className,
          endIcon: Boolean(endIcon),
          size: resolvedSize,
          startIcon: Boolean(startIcon),
        })}
        {...props}
      />
    </InputFrame>
  );
}

export { Input };
