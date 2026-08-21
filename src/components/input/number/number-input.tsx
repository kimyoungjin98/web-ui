import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { type FormSize } from "../../form-size";
import { getInputClassName, InputFrame } from "../style/input-style";

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
  size = "default",
  startIcon,
  thousandSeparator,
  placeholder,
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
        placeholder={placeholder}
        {...props}
        onValueChange={({ floatValue }) =>
          onChange(getNumberInputValue(floatValue))
        }
      />
    </InputFrame>
  );
}

export { getNumberInputValue, NumberInput, type NumberInputProps };
