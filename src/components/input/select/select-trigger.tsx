"use client";

import * as React from "react";

import { cn } from "../../../libs/tailwind-util";
import Icon from "../../icon";
import { PopoverTrigger } from "../../popover";
import { getFormSize, type FormSize } from "../../form-size";
import { useSelectContext } from "./select-context";
import { selectTriggerClassName } from "./libs/select-styles";
import { composeSelectRefs } from "./libs/select-utils";

export function SelectTrigger({
  children,
  className,
  onKeyDown,
  ref,
  size,
  title,
  ...props
}: React.ComponentProps<"button"> & { size?: FormSize }) {
  const context = useSelectContext();
  const sizeStyle = getFormSize(size ?? context.size);
  const triggerRef = React.useMemo(
    () => composeSelectRefs(context.triggerRef, ref),
    [context.triggerRef, ref],
  );
  return (
    <PopoverTrigger asChild>
      <button
        title={title}
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        data-slot="select-trigger"
        disabled={context.disabled}
        className={cn(
          selectTriggerClassName,
          sizeStyle.height,
          sizeStyle.inputPadding,
          sizeStyle.text,
          className,
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || context.disabled || context.open)
            return;
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
        }}
        {...props}
      >
        <span
          className={cn("min-w-0 flex-1 truncate text-left", sizeStyle.text)}
        >
          {children}
        </span>
        <Icon
          name="lucide:chevron-down"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </button>
    </PopoverTrigger>
  );
}
