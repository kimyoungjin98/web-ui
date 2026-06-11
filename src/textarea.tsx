import * as React from "react";

import { cn } from "./lib/tailwind-util";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "select-none resize-none min-h-28 w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] font-semibold outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-ring focus:ring-3 focus:ring-ring/15",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
