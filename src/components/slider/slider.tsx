"use client";

import {
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { cn } from "../../libs/tailwind-util";
import type { ColorToken } from "../../themes/color-token";
import { Paragraph } from "../typography/paragraph";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

type Props = Omit<
  ComponentProps<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "min"
  | "max"
  | "step"
  | "color"
  | "size"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  unit?: string;
  tooltip?: boolean;
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
  step = 1,
  unit,
  tooltip = true,
  label,
  className,
  style,
  ...props
}: Props) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (minValue + maxValue) / 2,
  );
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const currentValue = Math.min(
    maxValue,
    Math.max(minValue, value ?? internalValue),
  );
  const progress =
    maxValue > minValue
      ? ((currentValue - minValue) / (maxValue - minValue)) * 100
      : 0;
  const valueText = `${currentValue.toLocaleString("ko-KR")}${unit ?? ""}`;
  const isTooltipOpen =
    tooltip &&
    !props.disabled &&
    !isTooltipDismissed &&
    (isHovered || isFocused || isDragging);

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip
          open={isTooltipOpen}
          onOpenChange={(open) => setIsTooltipDismissed(!open)}
        >
          <div
            className="slider-control"
            style={{ "--slider-ratio": progress / 100 } as CSSProperties}
          >
            <TooltipTrigger asChild>
              <span className="slider-tooltip-anchor" aria-hidden="true" />
            </TooltipTrigger>
            <input
              {...props}
              type="range"
              aria-label={
                props["aria-label"] ?? (props.id ? undefined : "값 선택")
              }
              className={cn("slider-input", className)}
              data-color={color}
              min={minValue}
              max={maxValue}
              step={step}
              value={currentValue}
              aria-valuetext={
                props["aria-valuetext"] ?? (unit ? valueText : undefined)
              }
              aria-describedby={
                [
                  props["aria-describedby"],
                  isTooltipOpen ? tooltipId : undefined,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              style={
                { ...style, "--slider-ratio": progress / 100 } as CSSProperties
              }
              onPointerEnter={(event) => {
                setIsHovered(true);
                setIsTooltipDismissed(false);
                props.onPointerEnter?.(event);
              }}
              onPointerLeave={(event) => {
                setIsHovered(false);
                props.onPointerLeave?.(event);
              }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsDragging(true);
                setIsTooltipDismissed(false);
                props.onPointerDown?.(event);
              }}
              onPointerUp={(event) => {
                setIsDragging(false);
                props.onPointerUp?.(event);
              }}
              onPointerCancel={(event) => {
                setIsDragging(false);
                props.onPointerCancel?.(event);
              }}
              onLostPointerCapture={(event) => {
                setIsDragging(false);
                props.onLostPointerCapture?.(event);
              }}
              onFocus={(event) => {
                setIsFocused(true);
                setIsTooltipDismissed(false);
                props.onFocus?.(event);
              }}
              onBlur={(event) => {
                setIsFocused(false);
                setIsDragging(false);
                props.onBlur?.(event);
              }}
              onChange={(event) => {
                const nextValue = event.target.valueAsNumber;
                if (value === undefined) setInternalValue(nextValue);
                onValueChange?.(nextValue);
              }}
            />
          </div>
          <TooltipContent
            id={tooltipId}
            side="top"
            className="pointer-events-none"
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            {valueText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {label || unit ? (
        <div className="slider-labels">
          <Paragraph
            typography="t6"
            className="text-muted-foreground"
            fontWeight="medium"
          >
            {label?.min ?? `${minValue.toLocaleString("ko-KR")}${unit ?? ""}`}
          </Paragraph>
          {label?.mid ? (
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
            {label?.max ?? `${maxValue.toLocaleString("ko-KR")}${unit ?? ""}`}
          </Paragraph>
        </div>
      ) : null}
    </div>
  );
}
