"use client";
import * as React from "react";
import { cn } from "../../../libs/tailwind-util";
import Icon from "../../icon";
import { getFormSize } from "../../form-size";
import { useSelectContext } from "./select-context";
import { selectItemClassName } from "./libs/select-styles";
export function SelectItem({
  children,
  className,
  disabled = false,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
}) {
  const {
    activeValue,
    disabled: selectDisabled,
    registerOption,
    select,
    setActiveValue,
    size,
    value: selectedValue,
  } = useSelectContext();
  React.useEffect(() => {
    registerOption({ disabled, value, label: children });
  }, [children, disabled, registerOption, value]);
  const selected = value === selectedValue;
  const active = value === activeValue;
  return (
    <button
      type="button"
      role="option"
      data-select-item
      data-active={active}
      aria-selected={selected}
      tabIndex={active ? 0 : -1}
      disabled={selectDisabled || disabled}
      className={cn(
        selectItemClassName,
        getFormSize(size).selectItem,
        selected && "bg-muted",
        className,
      )}
      onFocus={() => setActiveValue(value)}
      onClick={() => select(value)}
    >
      <span className="absolute left-2 grid size-4 place-items-center">
        {selected ? <Icon name="lucide:check" className="size-4" /> : null}
      </span>
      {children}
    </button>
  );
}
