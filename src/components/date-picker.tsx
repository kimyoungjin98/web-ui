"use client";

import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { DateRange } from "react-day-picker";

import { Button } from "./button/button";
import { Calendar } from "./calendar";
import Icon from "./icon";
import { cn } from "../libs/tailwind-util";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

dayjs.extend(customParseFormat);

type DatePickerProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
};

type DateRangeValue = {
  from: string;
  to: string;
};

type DateRangePickerProps = {
  value: DateRangeValue;
  onValueChange: (value: DateRangeValue) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  fromName?: string;
  toName?: string;
  className?: string;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PICKER_TRIGGER_CLASS =
  "h-9 w-full justify-start rounded-md border border-input bg-card px-3 text-left font-semibold shadow-none outline-none transition-all hover:bg-card hover:text-foreground focus:border-ring focus:ring-3 focus:ring-ring/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50";

function DatePicker({
  value,
  onValueChange,
  placeholder = "날짜 선택",
  min,
  max,
  disabled,
  name,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(
    null,
  );
  const selectedDate = parseDateValue(value);
  const rootRef = React.useCallback((node: HTMLSpanElement | null) => {
    setPortalContainer(node?.closest("[data-slot='dialog-content']") ?? null);
  }, []);

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    onValueChange(formatDateValue(date));
    setOpen(false);
  }

  function handleTodaySelect() {
    const today = formatDateValue(new Date());

    if (!isDateDisabled(today, min, max)) {
      onValueChange(today);
      setOpen(false);
    }
  }

  return (
    <span ref={rootRef} className="block w-full">
      {name ? (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <span className="relative block w-full">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-label={value ? `선택한 날짜 ${value}` : placeholder}
              className={cn(
                PICKER_TRIGGER_CLASS,
                value ? "pr-16" : "pr-9",
                className,
              )}
            >
              <Icon
                name="lucide:calendar"
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  !value && "text-muted-foreground",
                )}
              >
                {value || placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          {value && !disabled ? (
            <button
              type="button"
              aria-label="날짜 초기화"
              className="absolute right-9 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              onClick={() => onValueChange("")}
            >
              <Icon name="lucide:x" className="size-3.5" />
            </button>
          ) : null}
          <Icon
            name="lucide:chevron-down"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </span>
        <PopoverContent
          align="start"
          collisionPadding={8}
          className="w-auto max-w-[calc(100vw-1rem)] overflow-auto border-input p-0"
          portalContainer={portalContainer}
          sideOffset={6}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => isDateDisabled(formatDateValue(date), min, max)}
          />
          <div className="flex items-center justify-between border-t border-input p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDateDisabled(formatDateValue(new Date()), min, max)}
              onClick={handleTodaySelect}
            >
              오늘
            </Button>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onValueChange("")}
              >
                초기화
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}

function DateRangePicker({
  value,
  onValueChange,
  placeholder = "기간 선택",
  min,
  max,
  disabled,
  fromName,
  toName,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(
    null,
  );
  const selectedFrom = parseDateValue(value.from);
  const selectedTo = parseDateValue(value.to);
  const selectedRange =
    selectedFrom || selectedTo
      ? { from: selectedFrom, to: selectedTo }
      : undefined;
  const hasValue = Boolean(value.from || value.to);
  const rootRef = React.useCallback((node: HTMLSpanElement | null) => {
    setPortalContainer(node?.closest("[data-slot='dialog-content']") ?? null);
  }, []);

  function handleSelect(range: DateRange | undefined, selectedDate: Date) {
    const selectedValue = formatDateValue(selectedDate);

    if (value.from && value.to) {
      onValueChange({ from: selectedValue, to: "" });
      return;
    }

    if (value.from && !value.to && value.from === selectedValue) {
      onValueChange({ from: selectedValue, to: selectedValue });
      setOpen(false);
      return;
    }

    const nextValue = {
      from: range?.from ? formatDateValue(range.from) : "",
      to: range?.to ? formatDateValue(range.to) : "",
    };

    onValueChange(nextValue);

    if (nextValue.from && nextValue.to) {
      setOpen(false);
    }
  }

  function handleClear() {
    onValueChange({ from: "", to: "" });
  }

  return (
    <span ref={rootRef} className="block w-full">
      {fromName ? (
        <input
          type="hidden"
          name={fromName}
          value={value.from}
          disabled={disabled}
        />
      ) : null}
      {toName ? (
        <input
          type="hidden"
          name={toName}
          value={value.to}
          disabled={disabled}
        />
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <span className="relative block w-full">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-label={
                hasValue
                  ? `선택한 기간 ${value.from || ""}부터 ${value.to || ""}까지`
                  : placeholder
              }
              className={cn(
                PICKER_TRIGGER_CLASS,
                hasValue ? "pr-16" : "pr-9",
                className,
              )}
            >
              <Icon
                name="lucide:calendar-range"
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  !hasValue && "text-muted-foreground",
                )}
              >
                {hasValue
                  ? `${value.from || "시작일"} ~ ${value.to || "종료일"}`
                  : placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          {hasValue && !disabled ? (
            <button
              type="button"
              aria-label="기간 초기화"
              className="absolute right-9 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              onClick={handleClear}
            >
              <Icon name="lucide:x" className="size-3.5" />
            </button>
          ) : null}
          <Icon
            name="lucide:chevron-down"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </span>
        <PopoverContent
          align="start"
          collisionPadding={8}
          className="w-auto max-w-[calc(100vw-1rem)] overflow-auto border-input p-0"
          portalContainer={portalContainer}
          sideOffset={6}
        >
          <Calendar
            mode="range"
            selected={selectedRange}
            defaultMonth={selectedRange?.from}
            onSelect={handleSelect}
            numberOfMonths={2}
            min={1}
            disabled={(date) => isDateDisabled(formatDateValue(date), min, max)}
          />
          {hasValue ? (
            <div className="flex items-center justify-end border-t border-input p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                초기화
              </Button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </span>
  );
}

function parseDateValue(value: string): Date | undefined {
  const date = parseDateParts(value);

  return date ? new Date(date.year, date.month - 1, date.day) : undefined;
}

function parseDateParts(value: string): DateParts | null {
  if (!DATE_PATTERN.test(value)) return null;

  const date = dayjs(value, "YYYY-MM-DD", true);

  if (!date.isValid()) {
    return null;
  }

  return {
    year: date.year(),
    month: date.month() + 1,
    day: date.date(),
  };
}

function formatDateValue(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

function isDateDisabled(value: string, min?: string, max?: string) {
  return Boolean((min && value < min) || (max && value > max));
}

export { DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps, DateRangeValue };
