"use client";

import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { type FormSize } from "../../form-size";
import { getInputClassName, InputFrame } from "../style/input-style";
import { useUiSize } from "../../../providers/ui-size-provider";

type NumberInputProps = Omit<
  NumericFormatProps,
  "allowNegative" | "onChange" | "size" | "thousandSeparator" | "value"
> & {
  value?: number;
  onChange: (value: number) => void;
  thousandSeparator?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: FormSize;
  placeholder?: string;
};

function getNumberInputValue(floatValue: number | undefined) {
  return floatValue ?? 0;
}

function NumberInput({
  className,
  endIcon,
  onChange,
  onFocus,
  onKeyDown,
  size,
  startIcon,
  thousandSeparator,
  placeholder,
  value,
  ...props
}: NumberInputProps) {
  const resolvedSize = useUiSize("numberInput", size, "default");

  return (
    <InputFrame endIcon={endIcon} size={resolvedSize} startIcon={startIcon}>
      <NumericFormat
        allowNegative={false}
        className={getInputClassName({
          className,
          endIcon: Boolean(endIcon),
          size: resolvedSize,
          startIcon: Boolean(startIcon),
        })}
        thousandSeparator={thousandSeparator}
        placeholder={placeholder}
        value={value}
        {...props}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented && value === 0) {
            event.currentTarget.select();
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            !event.defaultPrevented &&
            value === 0 &&
            /^\d$/.test(event.key)
          ) {
            event.currentTarget.select();
          }
        }}
        onValueChange={({ floatValue }) =>
          onChange(getNumberInputValue(floatValue))
        }
      />
    </InputFrame>
  );
}

export { getNumberInputValue, NumberInput, type NumberInputProps };
