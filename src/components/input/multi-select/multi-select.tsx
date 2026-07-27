"use client";

import * as React from "react";
import Icon from "../../icon";
import { Checkbox } from "../../checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { getFormSize } from "../../form-size";
import { Input } from "../input";
import { getInputBaseClassName } from "../style/input-style";
import { cn } from "../../../libs";

export type MultiSelectOption = { value: string; label: string };

export function MultiSelect({
  label,
  icon,
  options,
  value,
  onValueChange,
}: {
  label: string;
  icon?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = new Set(value);
  const sizeStyle = getFormSize();
  const visible = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            getInputBaseClassName(),
            "select-none flex items-center justify-between gap-2 text-left",
            sizeStyle.height,
            sizeStyle.inputPadding,
            sizeStyle.text,
            open && "border-ring ring-3 ring-ring/15",
          )}
        >
          {icon ? (
            <Icon
              name={icon}
              className="size-4 shrink-0 text-muted-foreground"
            />
          ) : null}
          <span className="min-w-0 flex-1 truncate">
            {value.length ? `${label} ${value.length}개 선택` : `${label}`}
          </span>
          <Icon
            name="lucide:chevron-down"
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2 shadow-lg">
        <div className="grid gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${label} 검색`}
          />
          <div className="grid max-h-48 gap-1 overflow-y-auto">
            {visible.map((option) => (
              <Checkbox
                key={option.value}
                size="sm"
                checked={selected.has(option.value)}
                label={option.label}
                containerClassName="bg-card"
                onChange={() =>
                  onValueChange(
                    selected.has(option.value)
                      ? value.filter((id) => id !== option.value)
                      : [...value, option.value],
                  )
                }
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
