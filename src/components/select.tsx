"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import Icon from "./icon";
import { cn } from "../libs/tailwind-util";

const EMPTY_VALUE = "__empty_select_value__";

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
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <SelectPrimitive.Root
      value={toRadixValue(value)}
      defaultValue={toRadixValue(defaultValue)}
      onValueChange={
        onValueChange
          ? (nextValue) => onValueChange(fromRadixValue(nextValue))
          : undefined
      }
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "select-none flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-sm font-semibold outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/15",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left text-sm">
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
  return (
    <SelectPrimitive.Portal>
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
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={toRadixValue(value)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm font-semibold outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
