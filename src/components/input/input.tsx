import * as React from "react";

import { type FormSize } from "../form-size";
import { getInputClassName, InputFrame } from "./style/input-style";

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
  return (
    <InputFrame endIcon={endIcon} size={size} startIcon={startIcon}>
      <input
        data-slot="input"
        className={getInputClassName({
          className,
          endIcon: Boolean(endIcon),
          size,
          startIcon: Boolean(startIcon),
        })}
        {...props}
      />
    </InputFrame>
  );
}

export { Input };
