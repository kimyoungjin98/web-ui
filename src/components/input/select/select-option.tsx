"use client";

import * as React from "react";

import { cn } from "../../../libs/tailwind-util";
import Icon from "../../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { getFormSize } from "../../form-size";
import { Input } from "../input";
import {
  createSearchSelectOption,
  filterSearchSelectOptions,
} from "./search-select/search-select.utils";
import {
  selectContentClassName,
  selectItemClassName,
  selectTriggerClassName,
} from "./libs/select-styles";
import type { OptionSelectProps, SelectOption } from "./libs/select-types";
import { resolveSelectPortalContainer } from "./libs/select-utils";

export function OptionSelect<TOption extends SelectOption>(
  props: OptionSelectProps<TOption>,
) {
  const {
    "aria-label": ariaLabel,
    defaultValue = "",
    disabled = false,
    id,
    options,
    filterOption,
    emptyMessage = "검색 결과가 없습니다.",
    createMessage = (query) => `“${query}” 등록`,
    onCreateOption,
    onSearchChange,
    placeholder = "선택하세요",
    renderOption,
    renderValue,
    searchable = false,
    searchPlaceholder = "옵션 검색",
    size = "default",
    shouldFilter = true,
    title,
    triggerStartAdornment,
  } = props;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const value = props.multiple ? undefined : (props.value ?? uncontrolledValue);
  const selectedValues = props.multiple ? props.value : [value];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );
  const selectedOption = options.find((option) => option.value === value);
  const matchingOptions = React.useMemo(
    () =>
      !shouldFilter
        ? [...options]
        : filterOption
          ? options.filter((option) => filterOption(option, query))
          : filterSearchSelectOptions(options, query),
    [filterOption, options, query, shouldFilter],
  );
  const sizeStyle = getFormSize(size);
  const canCreate =
    !props.multiple &&
    Boolean(onCreateOption) &&
    query.trim().length > 0 &&
    matchingOptions.length === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      onSearchChange?.("");
    }
  };

  const handleCreate = async () => {
    if (!onCreateOption || !canCreate || isCreating) return;

    setIsCreating(true);
    try {
      const createdOption = await createSearchSelectOption(
        query,
        matchingOptions,
        onCreateOption,
      );
      if (createdOption && !props.multiple) {
        if (props.value === undefined)
          setUncontrolledValue(createdOption.value);
        props.onValueChange?.(createdOption.value);
        handleOpenChange(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const select = (nextValue: string) => {
    if (props.multiple) {
      props.onValueChange(
        props.value.includes(nextValue)
          ? props.value.filter((value) => value !== nextValue)
          : [...props.value, nextValue],
      );
      return;
    }
    if (props.value === undefined) setUncontrolledValue(nextValue);
    props.onValueChange?.(nextValue);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={setTrigger}
          id={id}
          title={title}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            selectTriggerClassName,
            sizeStyle.height,
            sizeStyle.inputPadding,
            sizeStyle.text,
          )}
        >
          {triggerStartAdornment}
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {renderValue?.(selectedOptions) ??
              (props.multiple
                ? selectedOptions.length
                  ? `${selectedOptions.length}개 선택`
                  : placeholder
                : (selectedOption?.label ?? placeholder))}
          </span>
          <Icon
            name="lucide:chevron-down"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        role="listbox"
        align="start"
        className={selectContentClassName}
        portalContainer={resolveSelectPortalContainer(trigger)}
      >
        {searchable ? (
          <Input
            className="mb-0.5"
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
        ) : null}
        {matchingOptions.length === 0 ? (
          <p
            className={cn(
              "px-3 py-6 text-center text-muted-foreground",
              sizeStyle.text,
            )}
          >
            {canCreate ? createMessage(query.trim()) : emptyMessage}
          </p>
        ) : (
          matchingOptions.map((option) => {
            const selected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={disabled || isCreating || option.disabled}
                className={cn(
                  selectItemClassName,
                  sizeStyle.selectItem,
                  selected && "bg-muted",
                )}
                onClick={() => select(option.value)}
              >
                {renderOption ? renderOption(option) : option.label}
              </button>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
