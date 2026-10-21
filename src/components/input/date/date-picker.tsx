"use client";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../../libs/tailwind-util";
import { Button } from "../../button/button";
import { Calendar } from "../../calendar";
import { getFormSize, type FormSize } from "../../form-size";
import Icon from "../../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { useUiSize } from "../../../providers/ui-size-provider";
import { getInputBaseClassName } from "../style/input-style";

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
  size?: FormSize;
  hiddenResetButton?: boolean;
};

type DateRangeValue = {
  from: string;
  to: string;
};

type DateRangePickerProps = {
  value: DateRangeValue;
  onValueChange: (value: DateRangeValue) => void;
  getRangeForDate?: (date: string) => DateRangeValue;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  fromName?: string;
  toName?: string;
  className?: string;
  size?: FormSize;
  hiddenResetButton?: boolean;
  readonly?: boolean;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

type MonthPickerProps = Omit<DatePickerProps, "value" | "onValueChange"> & {
  value: string;
  onValueChange: (value: string) => void;
};

type YearPickerProps = Omit<DatePickerProps, "value" | "onValueChange"> & {
  value: string;
  onValueChange: (value: string) => void;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PICKER_TRIGGER_CLASS = cn(
  getInputBaseClassName(),
  "active:scale-100 justify-start text-left shadow-none hover:bg-card focus:border-primary focus-visible:border-primary data-[state=open]:border-primary",
);

function DatePicker({
  value,
  onValueChange,
  placeholder = "날짜 선택",
  min,
  max,
  disabled,
  name,
  className,
  hiddenResetButton = false,
  size,
  ...triggerProps
}: DatePickerProps &
  Pick<
    React.ComponentProps<"button">,
    "id" | "aria-invalid" | "aria-describedby" | "onBlur"
  >) {
  const [open, setOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(
    null,
  );
  const selectedDate = parseDateValue(value);
  const resolvedSize = useUiSize("datePicker", size, "default");
  const sizeStyle = getFormSize(resolvedSize);
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
              {...triggerProps}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-label={value ? `선택한 날짜 ${value}` : placeholder}
              className={cn(
                PICKER_TRIGGER_CLASS,
                sizeStyle.height,
                sizeStyle.inputPadding,
                sizeStyle.text,
                value ? "pr-16" : "pr-9",
                className,
              )}
            >
              <Icon
                name="lucide:calendar"
                className={cn(
                  "shrink-0 text-muted-foreground",
                  resolvedSize === "xs" ? "size-3.5" : "size-4",
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1",
                  sizeStyle.text,
                  !value && "text-muted-foreground",
                )}
              >
                {value || placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          {value && !disabled && !hiddenResetButton ? (
            <button
              type="button"
              aria-label="날짜 초기화"
              className="absolute right-9 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-base-content focus:outline-none focus:ring-2 focus:ring-ring/20"
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
  getRangeForDate,
  placeholder = "기간 선택",
  min,
  max,
  disabled,
  fromName,
  toName,
  className,
  size,
  hiddenResetButton = false,
  readonly,
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
  const resolvedSize = useUiSize("dateRangePicker", size, "default");
  const sizeStyle = getFormSize(resolvedSize);
  const rootRef = React.useCallback((node: HTMLSpanElement | null) => {
    setPortalContainer(node?.closest("[data-slot='dialog-content']") ?? null);
  }, []);

  function handleSelect(range: DateRange | undefined, selectedDate: Date) {
    if (readonly) {
      return;
    }

    const selectedValue = formatDateValue(selectedDate);

    if (getRangeForDate) {
      onValueChange(getRangeForDate(selectedValue));
      setOpen(false);
      return;
    }

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
      <Popover open={readonly ? false : open} onOpenChange={setOpen}>
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
                sizeStyle.height,
                sizeStyle.inputPadding,
                sizeStyle.text,
                hasValue ? "pr-16" : "pr-9",
                readonly ? "cursor-default pr-6" : "",
                className,
              )}
            >
              <Icon
                name="lucide:calendar-range"
                className={cn(
                  "shrink-0 text-muted-foreground",
                  resolvedSize === "xs" ? "size-3.5" : "size-4",
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  sizeStyle.text,
                  !hasValue && "text-muted-foreground",
                )}
              >
                {hasValue
                  ? `${value.from || "시작일"} ~ ${value.to || "종료일"}`
                  : placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          {hasValue && !disabled && !hiddenResetButton ? (
            <button
              type="button"
              aria-label="기간 초기화"
              className="absolute right-9 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-base-content focus:outline-none focus:ring-2 focus:ring-ring/20"
              onClick={handleClear}
            >
              <Icon name="lucide:x" className="size-3.5" />
            </button>
          ) : null}
          {readonly ? null : (
            <Icon
              name="lucide:chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          )}
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
          {hasValue && !hiddenResetButton ? (
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

function MonthPicker({
  value,
  onValueChange,
  placeholder = "월 선택",
  disabled,
  size,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(
    () => Number(value.slice(0, 4)) || dayjs().year(),
  );
  const resolvedSize = useUiSize("monthPicker", size, "default");
  const sizeStyle = getFormSize(resolvedSize);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            PICKER_TRIGGER_CLASS,
            sizeStyle.height,
            sizeStyle.inputPadding,
            sizeStyle.text,
            className,
          )}
        >
          <Icon
            name="lucide:calendar"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span
            className={cn(
              "flex-1 text-left",
              !value && "text-muted-foreground",
            )}
          >
            {value || placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <div className="mb-3 flex items-center justify-between">
          <b>{year}년</b>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="이전 연도"
              onClick={() => setYear((current) => current - 1)}
            >
              <Icon name="lucide:chevron-left" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setYear(dayjs().year())}
            >
              오늘
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="다음 연도"
              onClick={() => setYear((current) => current + 1)}
            >
              <Icon name="lucide:chevron-right" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }, (_, index) => {
            const month = String(index + 1).padStart(2, "0");
            const next = `${year}-${month}`;
            return (
              <Button
                key={month}
                type="button"
                size="sm"
                variant={value === next ? "solid" : "ghost"}
                onClick={() => {
                  onValueChange(next);
                  setOpen(false);
                }}
              >
                {index + 1}월
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function YearPicker({
  value,
  onValueChange,
  placeholder = "연도 선택",
  disabled,
  size,
  className,
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [startYear, setStartYear] = React.useState(
    () => Math.floor((Number(value) || dayjs().year()) / 12) * 12,
  );
  const resolvedSize = useUiSize("yearPicker", size, "default");
  const sizeStyle = getFormSize(resolvedSize);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            PICKER_TRIGGER_CLASS,
            sizeStyle.height,
            sizeStyle.inputPadding,
            sizeStyle.text,
            className,
          )}
        >
          <Icon
            name="lucide:calendar"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span
            className={cn(
              "flex-1 text-left",
              !value && "text-muted-foreground",
            )}
          >
            {value ? `${value}년` : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <div className="mb-3 flex items-center justify-between">
          <b>
            {startYear}–{startYear + 11}
          </b>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="이전 연도 범위"
              onClick={() => setStartYear((current) => current - 12)}
            >
              <Icon name="lucide:chevron-left" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setStartYear(Math.floor(dayjs().year() / 12) * 12)}
            >
              오늘
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="다음 연도 범위"
              onClick={() => setStartYear((current) => current + 12)}
            >
              <Icon name="lucide:chevron-right" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }, (_, index) => {
            const year = String(startYear + index);
            return (
              <Button
                key={year}
                type="button"
                size="sm"
                variant={value === year ? "solid" : "ghost"}
                onClick={() => {
                  onValueChange(year);
                  setOpen(false);
                }}
              >
                {year}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
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

export { DatePicker, DateRangePicker, MonthPicker, YearPicker };
export type {
  DatePickerProps,
  DateRangePickerProps,
  DateRangeValue,
  MonthPickerProps,
  YearPickerProps,
};
