import { cn } from "../../../../libs/tailwind-util";

export const selectTriggerClassName = cn(
  "flex w-full select-none items-center justify-between gap-2 rounded-lg",
  "border border-input bg-card font-semibold outline-none transition-all",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export const selectContentClassName = cn(
  "w-max min-w-(--radix-popover-trigger-width)",
  "max-w-(--radix-popover-content-available-width)",
  "max-h-72 overflow-y-auto p-1 flex flex-col gap-0.5",
);

export const selectItemClassName = cn(
  "relative flex w-full min-w-max cursor-pointer select-none items-center rounded-lg",
  "font-semibold outline-none transition-colors",
  "hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "disabled:pointer-events-none disabled:opacity-50",
);
