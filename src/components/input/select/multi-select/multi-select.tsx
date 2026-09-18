"use client";

import Icon from "../../../icon";
import type { IconName } from "../../../icon";
import { Select } from "../select";

export type MultiSelectOption = { value: string; label: string };

/** @deprecated Use the option-based Select with multiple and searchable instead. */
export function MultiSelect({
  label,
  icon,
  options,
  value,
  title,
  onValueChange,
}: {
  label: string;
  icon?: IconName;
  title?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  return (
    <Select
      aria-label={label}
      multiple
      searchable
      options={options}
      value={value}
      title={title}
      placeholder={label}
      searchPlaceholder={`${label} 검색`}
      triggerStartAdornment={
        icon ? (
          <Icon name={icon} className="size-4 shrink-0 text-muted-foreground" />
        ) : null
      }
      renderValue={(selectedOptions) =>
        selectedOptions.length
          ? `${label} ${selectedOptions.length}개 선택`
          : label
      }
      onValueChange={onValueChange}
    />
  );
}
