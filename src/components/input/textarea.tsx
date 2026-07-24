import * as React from "react";

import { cn } from "../../libs/tailwind-util";
import { getInputBaseClassName } from "./style/input-style";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        getInputBaseClassName(),
        "resize-none min-h-28 px-3 py-2.5 text-[14px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
