import type * as React from "react";

import type { FormSize } from "../../../form-size";
import type { SearchSelectOption } from "../search-select/search-select.utils";

export type CompoundSelectProps = {
  children: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  size?: FormSize;
  value?: string;
};

export type SelectOption = SearchSelectOption;

type OptionSelectBaseProps<TOption extends SelectOption> = {
  "aria-label"?: string;
  createMessage?: (query: string) => React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  emptyMessage?: string;
  filterOption?: (option: TOption, query: string) => boolean;
  /** 드롭다운 옵션 목록 아래에 고정으로 렌더되는 영역 (예: 전체 선택 버튼). */
  footerSlot?: React.ReactNode;
  id?: string;
  onCreateOption?: (query: string) => TOption | void | Promise<TOption | void>;
  onSearchChange?: (query: string) => void;
  options: readonly TOption[];
  placeholder?: React.ReactNode;
  renderOption?: (option: TOption) => React.ReactNode;
  renderValue?: (selectedOptions: readonly TOption[]) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  shouldFilter?: boolean;
  size?: FormSize;
  title?: string;
  triggerStartAdornment?: React.ReactNode;
};

export type OptionSelectProps<TOption extends SelectOption> =
  | (OptionSelectBaseProps<TOption> & {
      multiple?: false;
      onValueChange?: (value: string) => void;
      value?: string;
    })
  | (OptionSelectBaseProps<TOption> & {
      multiple: true;
      onValueChange: (value: string[]) => void;
      value: readonly string[];
    });
