"use client";
import * as React from "react";
import { cn } from "../../../libs/tailwind-util";
import { PopoverContent } from "../../popover";
import { useSelectContext } from "./select-context";
import { selectContentClassName } from "./libs/select-styles";

export function SelectContent({
  align = "start",
  className,
  onCloseAutoFocus,
  onKeyDown,
  sideOffset = 6,
  ...props
}: Omit<React.ComponentProps<typeof PopoverContent>, "children"> & {
  children: React.ReactNode;
}) {
  const context = useSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!context.open || !context.activeValue) return;
    contentRef.current
      ?.querySelector<HTMLElement>("[data-select-item][data-active='true']")
      ?.focus();
  }, [context.activeValue, context.open]);
  return (
    <PopoverContent
      ref={contentRef}
      role="listbox"
      align={align}
      sideOffset={sideOffset}
      className={cn(selectContentClassName, className)}
      onCloseAutoFocus={(event) => {
        onCloseAutoFocus?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        window.setTimeout(() => context.triggerRef.current?.focus());
      }}
      onKeyDown={(event) => {
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
      }}
      {...props}
    />
  );
}
