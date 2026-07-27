"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import Icon from "../../icon";
import { cn } from "../../../libs/tailwind-util";
import { getFormSize, type FormSize } from "../../form-size";

const EMPTY_VALUE = "__empty_select_value__";

type SelectPortalContainer = React.ComponentProps<
  typeof SelectPrimitive.Portal
>["container"];

type SelectPortalContextValue = {
  portalContainer: SelectPortalContainer;
  setPortalTrigger: (trigger: HTMLButtonElement | null) => void;
  size: FormSize;
};

const SelectPortalContext =
  React.createContext<SelectPortalContextValue | null>(null);

type ClosestTarget<T> = {
  closest: (selectors: string) => T | null;
};

export function resolveSelectPortalContainer<T>(
  trigger: ClosestTarget<T> | null,
): T | undefined {
  return trigger?.closest("[data-slot='dialog-content']") ?? undefined;
}

type PossibleRef<T> = React.Ref<T> | undefined;

function setSelectRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function composeSelectRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  return (value) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setSelectRef(ref, value);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setSelectRef(refs[index], null);
          }
        });
      };
    }
  };
}

function toRadixValue(value: string): string;
function toRadixValue(value: undefined): undefined;
function toRadixValue(value: string | undefined): string | undefined;
function toRadixValue(value: string | undefined) {
  return value === "" ? EMPTY_VALUE : value;
}

function fromRadixValue(value: string) {
  return value === EMPTY_VALUE ? "" : value;
}

function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & { size?: FormSize }) {
  const [portalContainer, setPortalContainer] =
    React.useState<SelectPortalContainer>();
  const setPortalTrigger = React.useCallback(
    (trigger: HTMLButtonElement | null) => {
      setPortalContainer(resolveSelectPortalContainer(trigger));
    },
    [],
  );
  const portalContext = React.useMemo(
    () => ({ portalContainer, setPortalTrigger, size }),
    [portalContainer, setPortalTrigger, size],
  );

  return (
    <SelectPortalContext.Provider value={portalContext}>
      <SelectPrimitive.Root
        value={toRadixValue(value)}
        defaultValue={toRadixValue(defaultValue)}
        onValueChange={
          onValueChange
            ? (nextValue) => onValueChange(fromRadixValue(nextValue))
            : undefined
        }
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectPortalContext.Provider>
  );
}

function SelectTrigger({
  className,
  children,
  ref,
  size,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: FormSize }) {
  const selectContext = React.useContext(SelectPortalContext);
  const setPortalTrigger = selectContext?.setPortalTrigger;
  const sizeStyle = getFormSize(size ?? selectContext?.size);
  const triggerRef = React.useMemo(
    () => composeSelectRefs(setPortalTrigger, ref),
    [ref, setPortalTrigger],
  );

  return (
    <SelectPrimitive.Trigger
      ref={triggerRef}
      data-slot="select-trigger"
      className={cn(
        "select-none flex w-full items-center justify-between gap-2 rounded-md border border-input bg-card font-semibold outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/15",
        sizeStyle.height,
        sizeStyle.inputPadding,
        sizeStyle.text,
        className,
      )}
      {...props}
    >
      <span className={cn("min-w-0 flex-1 truncate text-left", sizeStyle.text)}>
        {children}
      </span>
      <SelectPrimitive.Icon className="flex items-center">
        <Icon
          name="lucide:chevron-down"
          className="size-4 shrink-0 text-muted-foreground flex items-center"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const portalContainer =
    React.useContext(SelectPortalContext)?.portalContainer;

  return (
    <SelectPrimitive.Portal
      {...(portalContainer ? { container: portalContainer } : undefined)}
    >
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "select-none relative z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md bg-popover text-popover-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const sizeStyle = getFormSize(React.useContext(SelectPortalContext)?.size);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={toRadixValue(value)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md font-semibold outline-none transition-colors focus:bg-muted focus:text-base-content data-[highlighted]:bg-muted data-[highlighted]:text-base-content data-[state=checked]:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        sizeStyle.selectItem,
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon name="lucide:check" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
