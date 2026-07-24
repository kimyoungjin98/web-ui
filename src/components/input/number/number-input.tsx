import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { type FormSize } from "../../form-size";
import { getInputClassName, InputFrame } from "../style/input-style";

type NumberInputProps = Omit<
  NumericFormatProps,
  "allowNegative" | "onValueChange" | "size" | "thousandSeparator" | "value"
> & {
  value?: number;
  onValueChange: (value: number) => void;
  thousandSeparator?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: FormSize;
};

function getNumberInputValue(floatValue: number | undefined) {
  return floatValue ?? 0;
}

function NumberInput({
  className,
  endIcon,
  onValueChange,
  size = "default",
  startIcon,
  thousandSeparator,
  ...props
}: NumberInputProps) {
  return (
    <InputFrame endIcon={endIcon} size={size} startIcon={startIcon}>
      <NumericFormat
        allowNegative={false}
        className={getInputClassName({
          className,
          endIcon: Boolean(endIcon),
          size,
          startIcon: Boolean(startIcon),
        })}
        thousandSeparator={thousandSeparator}
        {...props}
        onValueChange={({ floatValue }) =>
          onValueChange(getNumberInputValue(floatValue))
        }
      />
    </InputFrame>
  );
}

export { getNumberInputValue, NumberInput, type NumberInputProps };
