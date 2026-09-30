"use client";

import { useState, type ComponentProps, type CSSProperties } from "react";
import { cn } from "../../libs/tailwind-util";
import type { ColorToken } from "../../themes/color-token";
import { Paragraph } from "../typography/paragraph";

type Props = Omit<
  ComponentProps<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "min"
  | "max"
  | "color"
  | "size"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  color?: ColorToken;
  label?: {
    min?: string;
    max?: string;
    mid?: string;
  };
};

export function Slider({
  color = "primary",
  value,
  defaultValue,
  onValueChange,
  minValue = 0,
  maxValue = 100,
  label,
  className,
  style,
  ...props
}: Props) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (minValue + maxValue) / 2,
  );
  const currentValue = Math.min(
    maxValue,
    Math.max(minValue, value ?? internalValue),
  );
  const progress =
    maxValue > minValue
      ? ((currentValue - minValue) / (maxValue - minValue)) * 100
      : 0;

  return (
    <div>
      <input
        {...props}
        type="range"
        aria-label={props["aria-label"] ?? (props.id ? undefined : "값 선택")}
        className={cn("slider-input", className)}
        data-color={color}
        min={minValue}
        max={maxValue}
        value={currentValue}
        style={{ ...style, "--slider-ratio": progress / 100 } as CSSProperties}
        onChange={(event) => {
          const nextValue = event.target.valueAsNumber;
          if (value === undefined) setInternalValue(nextValue);
          onValueChange?.(nextValue);
        }}
      />
      {label ? (
        <div className="slider-labels">
          <Paragraph
            typography="t6"
            className="text-muted-foreground"
            fontWeight="medium"
          >
            {label.min}
          </Paragraph>
          {label.mid ? (
            <Paragraph
              typography="t6"
              className="text-muted-foreground"
              fontWeight="medium"
            >
              {label.mid}
            </Paragraph>
          ) : null}
          <Paragraph
            typography="t6"
            className="text-muted-foreground"
            fontWeight="medium"
          >
            {label.max}
          </Paragraph>
        </div>
      ) : null}
    </div>
  );
}
