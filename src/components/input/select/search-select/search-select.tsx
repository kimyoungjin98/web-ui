"use client";

import * as React from "react";

import { type FormSize } from "../../../form-size";
import { Select } from "../select";
import { type SearchSelectOption } from "./search-select.utils";

export type { SearchSelectOption } from "./search-select.utils";

/** @deprecated Use the option-based Select with searchable instead. */
export type SearchSelectProps<TOption extends SearchSelectOption> = {
  options: readonly TOption[];
  title?: string;
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

/** @deprecated Use the option-based Select with searchable instead. */
export function SearchSelect<TOption extends SearchSelectOption>({
  selectedLabel,
  placeholder = "선택하세요",
  ...props
}: SearchSelectProps<TOption>) {
  return (
    <Select
      {...props}
      searchable
      placeholder={placeholder}
      renderValue={(selectedOptions) =>
        selectedOptions[0]?.label ?? selectedLabel ?? placeholder
      }
    />
  );
}
