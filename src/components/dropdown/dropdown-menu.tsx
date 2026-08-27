"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { cn } from "../../libs/tailwind-util";
import { useUiSize } from "../../providers/ui-size-provider";
import type { FormSize } from "../form-size";
import Icon from "../icon";

const DropdownMenuSizeContext = React.createContext<FormSize>("default");

const dropdownMenuSizeTokens: Record<
  FormSize,
  {
    content: string;
    indicator: string;
    item: string;
    inset: string;
    label: string;
    shortcut: string;
  }
> = {
  xs: {
    content: "p-0.5",
    indicator: "left-1.5 size-3",
    item: "gap-1.5 px-1.5 py-1 text-xs [&_svg]:size-3.5",
    inset: "pl-6",
    label: "px-1.5 py-1 text-xs",
    shortcut: "text-[0.625rem]",
  },
  sm: {
    content: "p-1",
    indicator: "left-2 size-3.5",
    item: "gap-1.5 px-2 py-1 text-[13px] [&_svg]:size-3.5",
    inset: "pl-7",
    label: "px-2 py-1 text-xs",
    shortcut: "text-xs",
  },
  default: {
    content: "p-1",
    indicator: "left-2 size-3.5",
    item: "gap-2 px-2 py-1.5 text-sm [&_svg]:size-4",
    inset: "pl-8",
    label: "px-2 py-1.5 text-sm",
    shortcut: "text-xs",
  },
  lg: {
    content: "p-1.5",
    indicator: "left-2.5 size-4",
    item: "gap-2.5 px-3 py-2 text-base [&_svg]:size-5",
    inset: "pl-10",
    label: "px-3 py-2 text-base",
    shortcut: "text-sm",
  },
};

function DropdownMenu({
  modal = false,
  size,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  size?: FormSize;
}) {
  const resolvedSize = useUiSize("dropdownMenu", size, "default");

  return (
    <DropdownMenuSizeContext.Provider value={resolvedSize}>
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        modal={modal}
        {...props}
      />
    </DropdownMenuSizeContext.Provider>
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      asChild
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  portalContainer,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  portalContainer?:
    | React.ComponentProps<typeof DropdownMenuPrimitive.Portal>["container"]
    | null;
}) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.Portal
      container={portalContainer}
      data-slot="dropdown-menu-portal"
    >
      <DropdownMenuPrimitive.Content
        onCloseAutoFocus={(ev) => {
          ev.preventDefault();
        }}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "dropdown-menu-content bg-popover text-popover-foreground z-50 min-w-36 overflow-hidden rounded-md border border-border !shadow-md",
          sizeToken.content,
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md outline-none transition-colors focus:bg-base-content/10 focus:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        sizeToken.item,
        inset && sizeToken.inset,
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md outline-none transition-colors focus:bg-muted focus:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0",
        sizeToken.item,
        sizeToken.inset,
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center",
          sizeToken.indicator,
        )}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon name="lucide:check" className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm outline-none focus:bg-muted data-[state=open]:bg-muted [&_svg]:shrink-0",
        sizeToken.item,
        inset && sizeToken.inset,
        className,
      )}
      {...props}
    >
      {children}
      <Icon name="lucide:chevron-right" className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "dropdown-menu-content bg-popover text-popover-foreground z-50 min-w-36 overflow-hidden rounded-md border border-border",
        sizeToken.content,
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md outline-none transition-colors focus:bg-muted focus:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0",
        sizeToken.item,
        sizeToken.inset,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center",
          sizeToken.indicator,
        )}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon name="lucide:circle" className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "font-semibold",
        sizeToken.label,
        inset && sizeToken.inset,
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const sizeToken =
    dropdownMenuSizeTokens[React.useContext(DropdownMenuSizeContext)];

  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto tracking-widest opacity-60",
        sizeToken.shortcut,
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
export type { FormSize as DropdownMenuSize };
