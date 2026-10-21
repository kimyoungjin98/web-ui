import { cn } from "../../../../libs/tailwind-util";
import { getInputBaseClassName } from "../../style/input-style";

export const selectTriggerClassName = cn(
  getInputBaseClassName(),
  "flex select-none items-center justify-between gap-2 focus:border-primary",
);

export const selectContentClassName = cn(
  "w-max min-w-(--radix-popover-trigger-width)",
  "max-w-(--radix-popover-content-available-width)",
  "max-h-72 overflow-y-auto p-1 flex flex-col gap-0.5",
);

export const selectItemClassName = cn(
  "relative flex w-full min-w-max cursor-pointer select-none items-center rounded-lg",
  "font-normal aria-selected:font-medium outline-none transition-colors",
  "hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "disabled:pointer-events-none disabled:opacity-50",
);
