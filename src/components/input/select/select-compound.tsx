"use client";
import * as React from "react";
import { Popover } from "../../popover";
import {
  SelectContext,
  type DeclaredSelectOption,
  type SelectDirection,
} from "./select-context";
import { SelectItem } from "./select-item";
import type { CompoundSelectProps } from "./libs/select-types";

function getDeclaredOptions(children: React.ReactNode): DeclaredSelectOption[] {
  const options: DeclaredSelectOption[] = [];
  React.Children.forEach(children, (child) => {
    if (
      !React.isValidElement<{
        children?: React.ReactNode;
        disabled?: boolean;
        value?: string;
      }>(child)
    )
      return;
    if (child.type === SelectItem && typeof child.props.value === "string") {
      options.push({
        disabled: child.props.disabled ?? false,
        label: child.props.children,
        value: child.props.value,
      });
      return;
    }
    options.push(...getDeclaredOptions(child.props.children));
  });
  return options;
}

export function CompoundSelect({
  children,
  defaultValue = "",
  disabled = false,
  onValueChange,
  size = "default",
  value: controlledValue,
}: CompoundSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [registeredOptions, setRegisteredOptions] = React.useState<
    DeclaredSelectOption[]
  >([]);
  const [activeValue, setActiveValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const value = controlledValue ?? uncontrolledValue;
  const declaredOptions = React.useMemo(
    () => getDeclaredOptions(children),
    [children],
  );
  const registerOption = React.useCallback(
    (option: DeclaredSelectOption) =>
      setRegisteredOptions((current) => {
        const index = current.findIndex((item) => item.value === option.value);
        if (index === -1) return [...current, option];
        const next = [...current];
        next[index] = option;
        return next;
      }),
    [],
  );
  const options = React.useMemo(
    () => [
      ...declaredOptions,
      ...registeredOptions.filter(
        (option) =>
          !declaredOptions.some((declared) => declared.value === option.value),
      ),
    ],
    [declaredOptions, registeredOptions],
  );
  const enabledOptions = React.useMemo(
    () => options.filter((option) => !option.disabled),
    [options],
  );
  const setSelectOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen)
        setActiveValue((current) =>
          enabledOptions.some((option) => option.value === current)
            ? current
            : (enabledOptions.find((option) => option.value === value)?.value ??
              enabledOptions[0]?.value ??
              ""),
        );
      setOpen(nextOpen);
    },
    [enabledOptions, value],
  );
  const openFromKeyboard = React.useCallback(
    (direction: "first" | "last") => {
      const option =
        enabledOptions.find((option) => option.value === value) ??
        (direction === "first" ? enabledOptions[0] : enabledOptions.at(-1));
      setActiveValue(option?.value ?? "");
      setOpen(true);
    },
    [enabledOptions, value],
  );
  const moveActive = React.useCallback(
    (direction: SelectDirection) => {
      if (!enabledOptions.length) return;
      setActiveValue((current) => {
        if (direction === "first") return enabledOptions[0]?.value ?? "";
        if (direction === "last") return enabledOptions.at(-1)?.value ?? "";
        const index = enabledOptions.findIndex(
          (option) => option.value === current,
        );
        const offset = direction === "next" ? 1 : -1;
        return (
          enabledOptions[
            (index + offset + enabledOptions.length) % enabledOptions.length
          ]?.value ?? ""
        );
      });
    },
    [enabledOptions],
  );
  const select = React.useCallback(
    (nextValue: string) => {
      if (controlledValue === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [controlledValue, onValueChange],
  );
  React.useEffect(() => {
    if (!open || activeValue || !enabledOptions.length) return;
    setActiveValue(
      enabledOptions.find((option) => option.value === value)?.value ??
        enabledOptions[0]?.value ??
        "",
    );
  }, [activeValue, enabledOptions, open, value]);
  const context = React.useMemo(
    () => ({
      activeValue,
      disabled,
      moveActive,
      open,
      openFromKeyboard,
      options,
      registerOption,
      select,
      setActiveValue,
      setOpen: setSelectOpen,
      size,
      triggerRef,
      value,
    }),
    [
      activeValue,
      disabled,
      moveActive,
      open,
      openFromKeyboard,
      options,
      registerOption,
      select,
      setSelectOpen,
      size,
      value,
    ],
  );
  return (
    <SelectContext.Provider value={context}>
      <Popover open={open} onOpenChange={setSelectOpen}>
        {children}
      </Popover>
    </SelectContext.Provider>
  );
}
