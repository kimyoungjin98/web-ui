"use client";

import * as React from "react";

import Icon from "../../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "../../../libs/tailwind-util";
import { getFormSize, type FormSize } from "../../form-size";
import { Input } from "../input";
import { resolveSelectPortalContainer } from "../select/select";
import {
  createSearchSelectOption,
  filterSearchSelectOptions,
  type SearchSelectOption,
} from "./search-select.utils";

export type { SearchSelectOption } from "./search-select.utils";

export type SearchSelectProps<TOption extends SearchSelectOption> = {
  options: readonly TOption[];
  id?: string;
  value?: string;
  selectedLabel?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onCreateOption?: (query: string) => TOption | void | Promise<TOption | void>;
  onSearchChange?: (query: string) => void;
  shouldFilter?: boolean;
  filterOption?: (option: TOption, query: string) => boolean;
  renderOption?: (option: TOption) => React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  createMessage?: (query: string) => React.ReactNode;
  disabled?: boolean;
  size?: FormSize;
};

export function SearchSelect<TOption extends SearchSelectOption>({
  options,
  id,
  value,
  selectedLabel,
  onValueChange,
  onCreateOption,
  onSearchChange,
  shouldFilter = true,
  filterOption,
  renderOption,
  placeholder = "선택하세요",
  searchPlaceholder = "옵션 검색",
  emptyMessage = "검색 결과가 없습니다.",
  createMessage = (query) => `“${query}” 등록`,
  disabled = false,
  size = "default",
}: SearchSelectProps<TOption>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const sizeStyle = getFormSize(size);

  const matchingOptions = React.useMemo(
    () =>
      !shouldFilter
        ? [...options]
        : filterOption
          ? options.filter((option) => filterOption(option, query))
          : filterSearchSelectOptions(options, query),
    [filterOption, options, query, shouldFilter],
  );
  const selectedOption = options.find((option) => option.value === value);
  const canCreate =
    Boolean(onCreateOption) &&
    query.trim().length > 0 &&
    matchingOptions.length === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  };

  const handleCreate = async () => {
    if (!onCreateOption || isCreating) return;

    setIsCreating(true);
    try {
      const createdOption = await createSearchSelectOption(
        query,
        matchingOptions,
        onCreateOption,
      );

      if (createdOption) {
        onValueChange?.(createdOption.value);
        setQuery("");
        setOpen(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={setTrigger}
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full select-none items-center justify-between gap-2 rounded-md border border-input bg-card font-semibold outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/15",
            sizeStyle.height,
            sizeStyle.inputPadding,
            sizeStyle.text,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? selectedLabel ?? placeholder}
          </span>
          <Icon
            name="lucide:chevron-down"
            className={cn(
              "shrink-0 text-muted-foreground",
              sizeStyle.icon
                .replace("left-2.5", "size-4")
                .replace("left-2", "size-3.5")
                .replace("left-3", "size-5"),
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-1"
        portalContainer={resolveSelectPortalContainer(trigger)}
      >
        <Input
          autoFocus
          value={query}
          disabled={disabled || isCreating}
          placeholder={searchPlaceholder}
          size={size}
          onChange={(event) => {
            setQuery(event.target.value);
            onSearchChange?.(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canCreate) {
              event.preventDefault();
              void handleCreate();
            }
          }}
        />
        <div
          className="flex flex-col gap-0.5 mt-1 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {matchingOptions.length > 0 ? (
            matchingOptions.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={disabled || isCreating || option.disabled}
                  className={cn(
                    "flex w-full cursor-pointer items-center rounded-md text-left font-semibold outline-none transition-colors hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50",
                    sizeStyle.selectItem,
                    selected && "bg-muted",
                  )}
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {renderOption ? renderOption(option) : option.label}
                </button>
              );
            })
          ) : (
            <p
              className={cn(
                "px-3 py-6 text-center text-muted-foreground",
                sizeStyle.text,
              )}
            >
              {canCreate ? createMessage(query.trim()) : emptyMessage}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
