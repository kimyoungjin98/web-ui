"use client";

import * as React from "react";

import Icon from "../../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "../../../libs/tailwind-util";
import { getFormSize, type FormSize } from "../../form-size";

type Option = { disabled: boolean; label: React.ReactNode; value: string };
type SelectContextValue = {
  activeValue: string;
  disabled: boolean;
  moveActive: (direction: "first" | "last" | "next" | "previous") => void;
  open: boolean;
  openFromKeyboard: (direction: "first" | "last") => void;
  options: Option[];
  registerOption: (option: Option) => void;
  select: (value: string) => void;
  setActiveValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  size: FormSize;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  value: string;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Select components must be used within Select.");
  return context;
}

export function resolveSelectPortalContainer<T extends { closest: (selector: string) => T | null }>(trigger: T | null): T | undefined {
  return trigger?.closest("[data-slot='dialog-content']") ?? undefined;
}

export function composeSelectRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") return ref(value);
      if (ref) ref.current = value;
      return undefined;
    });
    if (cleanups.some((cleanup) => typeof cleanup === "function")) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === "function") cleanup();
          const ref = refs[index];
          if (typeof ref === "function") ref(null);
          else if (ref) ref.current = null;
        });
      };
    }
  };
}

function getDeclaredOptions(children: React.ReactNode): Option[] {
  const options: Option[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode; disabled?: boolean; value?: string }>(child)) return;

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

function Select({ children, defaultValue = "", disabled = false, onValueChange, size = "default", value: controlledValue }: { children: React.ReactNode; defaultValue?: string; disabled?: boolean; onValueChange?: (value: string) => void; size?: FormSize; value?: string }) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [activeValue, setActiveValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const value = controlledValue ?? uncontrolledValue;
  const declaredOptions = React.useMemo(() => getDeclaredOptions(children), [children]);
  const registerOption = React.useCallback((option: Option) => {
    setOptions((current) => {
      const existing = current.findIndex((item) => item.value === option.value);
      if (existing === -1) return [...current, option];
      const next = [...current];
      next[existing] = option;
      return next;
    });
  }, []);
  const availableOptions = React.useMemo(() => {
    const registeredOptions = options.filter(
      (option) => !declaredOptions.some((declared) => declared.value === option.value),
    );
    return [...declaredOptions, ...registeredOptions];
  }, [declaredOptions, options]);
  const enabledOptions = React.useMemo(
    () => availableOptions.filter((option) => !option.disabled),
    [availableOptions],
  );
  const setSelectOpen = React.useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setActiveValue((current) => {
        if (enabledOptions.some((option) => option.value === current)) return current;
        return enabledOptions.find((option) => option.value === value)?.value ?? enabledOptions[0]?.value ?? "";
      });
    }
    setOpen(nextOpen);
  }, [enabledOptions, value]);
  const openFromKeyboard = React.useCallback((direction: "first" | "last") => {
    const nextOption = enabledOptions.find((option) => option.value === value)
      ?? (direction === "first" ? enabledOptions[0] : enabledOptions.at(-1));
    setActiveValue(nextOption?.value ?? "");
    setOpen(true);
  }, [enabledOptions, value]);
  const moveActive = React.useCallback((direction: "first" | "last" | "next" | "previous") => {
    if (enabledOptions.length === 0) return;
    setActiveValue((current) => {
      if (direction === "first") return enabledOptions[0]?.value ?? "";
      if (direction === "last") return enabledOptions.at(-1)?.value ?? "";
      const currentIndex = enabledOptions.findIndex((option) => option.value === current);
      const offset = direction === "next" ? 1 : -1;
      return enabledOptions[(currentIndex + offset + enabledOptions.length) % enabledOptions.length]?.value ?? "";
    });
  }, [enabledOptions]);
  const select = React.useCallback((nextValue: string) => {
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  }, [controlledValue, onValueChange]);
  React.useEffect(() => {
    if (!open || activeValue || enabledOptions.length === 0) return;
    setActiveValue(enabledOptions.find((option) => option.value === value)?.value ?? enabledOptions[0]?.value ?? "");
  }, [activeValue, enabledOptions, open, value]);
  const context = React.useMemo(() => ({ activeValue, disabled, moveActive, open, openFromKeyboard, options: availableOptions, registerOption, select, setActiveValue, setOpen: setSelectOpen, size, triggerRef, value }), [activeValue, availableOptions, disabled, moveActive, open, openFromKeyboard, registerOption, select, setSelectOpen, size, value]);

  return <SelectContext.Provider value={context}><Popover open={open} onOpenChange={setSelectOpen}>{children}</Popover></SelectContext.Provider>;
}

function SelectTrigger({ children, className, onKeyDown, ref, size, ...props }: React.ComponentProps<"button"> & { size?: FormSize }) {
  const context = useSelectContext();
  const sizeStyle = getFormSize(size ?? context.size);
  const triggerRef = React.useMemo(
    () => composeSelectRefs(context.triggerRef, ref),
    [context.triggerRef, ref],
  );
  return <PopoverTrigger asChild><button ref={triggerRef} type="button" aria-haspopup="listbox" data-slot="select-trigger" disabled={context.disabled} className={cn("flex w-full select-none items-center justify-between gap-2 rounded-md border border-input bg-card font-semibold outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50", sizeStyle.height, sizeStyle.inputPadding, sizeStyle.text, className)} onKeyDown={(event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || context.disabled || context.open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      context.openFromKeyboard("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      context.openFromKeyboard("last");
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      context.openFromKeyboard("first");
    }
  }} {...props}><span className={cn("min-w-0 flex-1 truncate text-left", sizeStyle.text)}>{children}</span><Icon name="lucide:chevron-down" className="size-4 shrink-0 text-muted-foreground" /></button></PopoverTrigger>;
}

function SelectValue({ placeholder }: { placeholder?: React.ReactNode }) {
  const { options, value } = useSelectContext();
  return <span data-slot="select-value" className={!options.some((option) => option.value === value) ? "text-muted-foreground" : undefined}>{options.find((option) => option.value === value)?.label ?? placeholder}</span>;
}

function SelectContent({ align = "start", className, onCloseAutoFocus, onKeyDown, sideOffset = 6, ...props }: Omit<React.ComponentProps<typeof PopoverContent>, "children"> & { children: React.ReactNode }) {
  const context = useSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!context.open || !context.activeValue) return;
    contentRef.current?.querySelector<HTMLElement>("[data-select-item][data-active='true']")?.focus();
  }, [context.activeValue, context.open]);
  return <PopoverContent ref={contentRef} role="listbox" align={align} sideOffset={sideOffset} className={cn("w-(--radix-popover-trigger-width) max-h-72 overflow-y-auto p-1", className)} onCloseAutoFocus={(event) => {
    onCloseAutoFocus?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    window.setTimeout(() => context.triggerRef.current?.focus());
  }} onKeyDown={(event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      context.moveActive("next");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      context.moveActive("previous");
    } else if (event.key === "Home") {
      event.preventDefault();
      context.moveActive("first");
    } else if (event.key === "End") {
      event.preventDefault();
      context.moveActive("last");
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (context.activeValue) context.select(context.activeValue);
    } else if (event.key === "Escape") {
      event.preventDefault();
      context.setOpen(false);
      context.triggerRef.current?.focus();
    }
  }} {...props} />;
}

function SelectItem({ children, className, disabled = false, value }: { children: React.ReactNode; className?: string; disabled?: boolean; value: string }) {
  const { activeValue, disabled: selectDisabled, registerOption, select, setActiveValue, size, value: selectedValue } = useSelectContext();
  React.useEffect(() => { registerOption({ disabled, value, label: children }); }, [children, disabled, registerOption, value]);
  const selected = value === selectedValue;
  const active = value === activeValue;
  return <button type="button" role="option" data-select-item data-active={active} aria-selected={selected} tabIndex={active ? 0 : -1} disabled={selectDisabled || disabled} className={cn("relative flex w-full cursor-pointer select-none items-center rounded-md font-semibold outline-none transition-colors hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground disabled:pointer-events-none disabled:opacity-50", getFormSize(size).selectItem, selected && "bg-muted", className)} onFocus={() => setActiveValue(value)} onClick={() => select(value)}><span className="absolute left-2 grid size-4 place-items-center">{selected ? <Icon name="lucide:check" className="size-4" /> : null}</span>{children}</button>;
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
